"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Image as ImageIcon, Loader2 } from "lucide-react";
import FormInput from "./form/FormInput";
import FormSelect from "./form/FormSelect";
import { validateZod } from "@/hooks/useZodValidator";
import { branchSchema } from "@/lib/RegisterSchemas";
import { useFileUpload } from "@/hooks/useFileUpload";

declare global {
  interface Window {
    google?: any;
  }
}

interface Props {
  formData: any;
  updateFormData: (section: string, data: any) => void;
  next: () => void;
  back: () => void;
}

export default function BranchStep({
  formData,
  updateFormData,
  next,
  back,
}: Props) {
  const branch = formData.branch;

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [addressQuery, setAddressQuery] = useState("");

  const autocompleteInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteInstanceRef = useRef<any>(null);

  const { uploadFile, uploading, progress } = useFileUpload();

  /* ---------------- HELPERS ---------------- */

  const clearError = (path: string) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[path];
      return updated;
    });
  };

  const error = (path: string) => errors[path];

  const composeAddress = (address: any) => {
    return [
      address.street,
      address.area,
      address.city,
      address.state,
      address.country,
    ]
      .filter(Boolean)
      .join(", ");
  };

  const updateField = (field: keyof typeof branch, value: any) => {
    updateFormData("branch", { [field]: value });
    clearError(`branch.${String(field)}`);
  };

  const updateAddressField = (
    field: keyof typeof branch.address,
    value: any
  ) => {
    updateFormData("branch", {
      address: { ...branch.address, [field]: value },
    });
    clearError(`branch.address.${String(field)}`);
  };

  const updateSettingsField = (
    field: keyof typeof branch.settings,
    value: any
  ) => {
    updateFormData("branch", {
      settings: { ...branch.settings, [field]: value },
    });
    clearError(`branch.settings.${String(field)}`);
  };

  const getAddressComponent = (
    components: any[],
    types: string[],
    mode: "long_name" | "short_name" = "long_name"
  ) => {
    const component = components.find((item) =>
      types.some((type) => item.types?.includes(type))
    );
    return component?.[mode] || "";
  };

  const applyPlaceToForm = (place: any) => {
    if (!place) return;

    const components = place.address_components || [];
    const lat = place.geometry?.location?.lat?.();
    const lng = place.geometry?.location?.lng?.();

    const streetNumber = getAddressComponent(components, ["street_number"]);
    const route = getAddressComponent(components, ["route"]);
    const street =
      [streetNumber, route].filter(Boolean).join(" ").trim() ||
      place.name ||
      "";

    const area =
      getAddressComponent(components, [
        "sublocality",
        "sublocality_level_1",
        "neighborhood",
        "premise",
      ]) || "";

    const city =
      getAddressComponent(components, ["locality"]) ||
      getAddressComponent(components, ["administrative_area_level_2"]) ||
      "";

    const state =
      getAddressComponent(components, ["administrative_area_level_1"], "short_name") ||
      getAddressComponent(components, ["administrative_area_level_1"]) ||
      "";

    const country = getAddressComponent(components, ["country"]) || "Pakistan";

    updateFormData("branch", {
      address: {
        ...branch.address,
        street,
        area,
        city,
        state,
        country,
        lat: lat ? String(lat) : branch.address.lat,
        lng: lng ? String(lng) : branch.address.lng,
      },
    });

    setAddressQuery(place.formatted_address || composeAddress({
      street,
      area,
      city,
      state,
      country,
    }));

    [
      "branch.address.street",
      "branch.address.area",
      "branch.address.city",
      "branch.address.state",
      "branch.address.country",
      "branch.address.lat",
      "branch.address.lng",
    ].forEach(clearError);
  };

  /* ---------------- FILE ---------------- */

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);

    updateFormData("branch", {
      coverImageFile: file,
      coverImagePreviewUrl: blobUrl,
    });

    setErrors((prev) => {
      const updated = { ...prev };
      delete updated["branch.coverImage"];
      delete updated["branch.coverImageFile"];
      return updated;
    });

    const res = await uploadFile(e);

    if (res?.fileUrl) {
      updateFormData("branch", {
        coverImage: res.fileUrl,
      });
    }
  };

  /* ---------------- GOOGLE MAPS AUTOCOMPLETE ---------------- */

  useEffect(() => {
    if (!addressQuery) {
      const composed = composeAddress(branch.address);
      if (composed) {
        setAddressQuery(composed);
      }
    }
    // intentionally only on mount/revisit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let tries = 0;

    const initAutocomplete = () => {
      if (
        !autocompleteInputRef.current ||
        !window.google?.maps?.places?.Autocomplete ||
        autocompleteInstanceRef.current
      ) {
        return;
      }

      autocompleteInstanceRef.current = new window.google.maps.places.Autocomplete(
        autocompleteInputRef.current,
        {
          fields: ["address_components", "formatted_address", "geometry", "name"],
          types: ["geocode"],
          componentRestrictions: { country: "pk" },
        }
      );

      autocompleteInstanceRef.current.addListener("place_changed", () => {
        const place = autocompleteInstanceRef.current?.getPlace?.();
        applyPlaceToForm(place);
      });
    };

    initAutocomplete();

    if (!autocompleteInstanceRef.current) {
      intervalId = setInterval(() => {
        tries += 1;
        initAutocomplete();

        if (autocompleteInstanceRef.current || tries >= 20) {
          if (intervalId) clearInterval(intervalId);
        }
      }, 500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- CURRENT LOCATION ---------------- */
const handleGetCurrentLocation = async () => {
  setLocationError("");

  if (!navigator.geolocation) {
    setLocationError("Geolocation is not supported in this browser.");
    return;
  }

  setGettingLocation(true);

  try {
    // ✅ Check permission first
    const permission = await navigator.permissions.query({
      name: "geolocation" as PermissionName,
    });

    if (permission.state === "denied") {
      setGettingLocation(false);
      setLocationError("Location access is blocked. Please enable it in browser settings.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = String(position.coords.latitude);
        const lng = String(position.coords.longitude);

        updateFormData("branch", {
          address: {
            ...branch.address,
            lat,
            lng,
          },
        });

        clearError("branch.address.lat");
        clearError("branch.address.lng");

        // Google reverse geocode
        if (window.google?.maps?.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode(
            {
              location: { lat: Number(lat), lng: Number(lng) },
            },
            (results: any, status: string) => {
              if (status === "OK" && results?.[0]) {
                applyPlaceToForm(results[0]);
              }
              setGettingLocation(false);
            }
          );
          return;
        }

        setGettingLocation(false);
      },
      (geoError) => {
        setGettingLocation(false);

        if (geoError.code === geoError.PERMISSION_DENIED) {
          setLocationError("Please allow location access in your browser.");
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          setLocationError("Location unavailable.");
        } else if (geoError.code === geoError.TIMEOUT) {
          setLocationError("Request timed out.");
        } else {
          setLocationError("Unable to fetch location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } catch (err) {
    setGettingLocation(false);
    setLocationError("Permission check failed.");
  }
};

  /* ---------------- VALIDATION ---------------- */

  const handleNext = () => {
    const { success, errors } = validateZod(branchSchema, formData.branch, "branch");

    if (!success) {
      setErrors(errors);
      return;
    }

    setErrors({});
    next();
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl p-8">
      {/* Branch Info */}
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        Branch Info
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div>
          <FormInput
            label="Branch Name*"
            placeholder="F-6 Super Market"
            value={branch.name || ""}
            onChange={(val) => updateField("name", val)}
          />
          {error("branch.name") && (
            <p className="text-red-500 text-xs mt-1">{error("branch.name")}</p>
          )}
        </div>

        <div>
          <FormInput
            label="Description*"
            placeholder="Our flagship branch in Islamabad."
            value={branch.description || ""}
            onChange={(val) => updateField("description", val)}
          />
          {error("branch.description") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.description")}
            </p>
          )}
        </div>

        {/* Cover Image */}
        <div className="sm:col-span-2">
          <label className="text-[16px] mb-2 block">Cover Image</label>

          <label className="h-[190px] rounded-xl border border-dashed border-[#bbbbbb] bg-[#F5F5F5] flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden">
            {branch.coverImagePreviewUrl ? (
              <>
                <img
                  src={branch.coverImagePreviewUrl}
                  alt="cover preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
              </>
            ) : null}

            {uploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20">
                <Loader2 className="animate-spin text-white mb-2" size={28} />
                <p className="text-white text-sm font-semibold">{progress}%</p>
              </div>
            )}

            <div className="relative z-10 flex flex-col items-center justify-center px-4">
              {!branch.coverImagePreviewUrl && (
                <ImageIcon className="text-gray-400 mb-2" size={30} />
              )}

              <p className={`text-sm font-medium mt-2 ${branch.coverImagePreviewUrl ? "text-white" : ""}`}>
                <span className="text-primary">Click to upload</span>
                <span
                  className={`font-semibold ml-1 ${
                    branch.coverImagePreviewUrl ? "text-white" : "text-[#909090]"
                  }`}
                >
                  or drag and drop
                </span>
              </p>

              <p
                className={`text-xs mt-1 ${
                  branch.coverImagePreviewUrl ? "text-white/90" : "text-gray-400"
                }`}
              >
                JPG, JPEG, PNG less than 1MB
              </p>
            </div>

            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          {(error("branch.coverImageFile") || error("branch.coverImage")) && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.coverImageFile") || error("branch.coverImage")}
            </p>
          )}
        </div>
      </div>

      {/* Address */}
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        Address
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <div className="sm:col-span-2">
          <FormInput
            ref={autocompleteInputRef}
            label="Address (Google Maps)*"
            placeholder="Search and select address from Google Maps"
            value={addressQuery}
            onChange={(val) => setAddressQuery(val)}
          />
          <p className="text-xs text-[#909090] mt-1">
            If Google Maps Places API is loaded, selecting an address here will auto-fill
            street, area, city, state, country, latitude, and longitude.
          </p>
        </div>

        <div>
          <FormInput
            label="Street*"
            placeholder="Shop 12, Block A"
            value={branch.address.street || ""}
            onChange={(val) => updateAddressField("street", val)}
          />
          {error("branch.address.street") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.street")}
            </p>
          )}
        </div>

        <div>
          <FormInput
            label="Area*"
            placeholder="F-6 Super Market"
            value={branch.address.area || ""}
            onChange={(val) => updateAddressField("area", val)}
          />
          {error("branch.address.area") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.area")}
            </p>
          )}
        </div>

        <div>
          <FormInput
            label="City*"
            placeholder="Islamabad"
            value={branch.address.city || ""}
            onChange={(val) => updateAddressField("city", val)}
          />
          {error("branch.address.city") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.city")}
            </p>
          )}
        </div>

        <div>
          <FormInput
            label="State*"
            placeholder="ICT"
            value={branch.address.state || ""}
            onChange={(val) => updateAddressField("state", val)}
          />
          {error("branch.address.state") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.state")}
            </p>
          )}
        </div>

        <div>
          <label className="text-[16px] mb-2 block">Country*</label>
          <FormSelect
            placeholder="Country"
            options={["Pakistan"]}
            value={branch.address.country || "Pakistan"}
            onChange={(value) => updateAddressField("country", value)}
          />
          {error("branch.address.country") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.country")}
            </p>
          )}
        </div>
      </div>

      {/* Location */}
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        Location
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div>
          <label className="text-[16px] mb-2 block">Get Location</label>

          <Button
            type="button"
            variant="outline"
            onClick={handleGetCurrentLocation}
            disabled={gettingLocation}
            className="w-full justify-start gap-2 border-primary text-[#030401] rounded-[10px] py-6 disabled:opacity-50"
          >
            {gettingLocation ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <MapPin size={16} />
            )}
            {gettingLocation ? "Fetching Location..." : "Get Current Location"}
          </Button>

          {locationError && (
            <p className="text-red-500 text-xs mt-1">{locationError}</p>
          )}
        </div>

        <div>
          <FormInput
            label="Latitude*"
            placeholder="33.7297"
            value={branch.address.lat || ""}
            onChange={(val) => updateAddressField("lat", val)}
          />
          {error("branch.address.lat") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.lat")}
            </p>
          )}
        </div>

        <div>
          <FormInput
            label="Longitude*"
            placeholder="73.0745"
            value={branch.address.lng || ""}
            onChange={(val) => updateAddressField("lng", val)}
          />
          {error("branch.address.lng") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.address.lng")}
            </p>
          )}
        </div>
      </div>

      {/* Settings */}
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        Order Settings
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <FormInput
            label="Minimum Order Amount"
            placeholder="500"
            value={branch.settings.minOrderAmount ?? ""}
            onChange={(val) =>
              updateSettingsField(
                "minOrderAmount",
                val === "" ? 0 : Number(val)
              )
            }
          />
          {error("branch.settings.minOrderAmount") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.settings.minOrderAmount")}
            </p>
          )}
        </div>

        <div>
          <FormInput
            label="Delivery Radius (KM)"
            placeholder="7.5"
            value={branch.settings.radiusKm ?? ""}
            onChange={(val) =>
             updateSettingsField("radiusKm", val === "" ? "" : val)
            }
          />
          {error("branch.settings.radiusKm") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.settings.radiusKm")}
            </p>
          )}
        </div>

        <div>
          <FormInput
            label="Estimated Preparation Time (Minutes)"
            placeholder="25"
            value={branch.settings.estimatedPrepTime ?? ""}
            onChange={(val) =>
              updateSettingsField(
                "estimatedPrepTime",
                val === "" ? 0 : Number(val)
              )
            }
          />
          {error("branch.settings.estimatedPrepTime") && (
            <p className="text-red-500 text-xs mt-1">
              {error("branch.settings.estimatedPrepTime")}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-10">
        <Button
          onClick={back}
          className="px-6 py-2 rounded-full bg-[#F5F5F5] text-sm text-gray-500"
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={uploading || gettingLocation}
          className="bg-primary hover:bg-red-800 px-16 py-2.5 rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  );
}