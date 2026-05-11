"use client";

import { useEffect, useMemo, useState } from "react";

import StorePublished from "./StorePublished";
import UserInfoStep from "./form/UserInfoStep";
import TenantInfoStep from "./TenantInfoStep";
import BranchStep from "./BranchStep";
import SettingsStep from "./SettingsStep";
import { API_BASE_URL } from "@/lib/constants";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const steps = [
  { id: 1, label: "Account" },
  { id: 2, label: "Tenant & Restaurant" },
  { id: 3, label: "Branch" },
  { id: 4, label: "Payment & Delivery" },
  { id: 5, label: "Published" },
];

const normalizeEmail = (email?: string) => {
  return String(email || "").trim().toLowerCase();
};

const isUserAlreadyExistsError = (data: any) => {
  const message = [
    data?.message,
    data?.error?.message,
    data?.error?.code,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return message.includes("user already exists");
};

const extractAccessToken = (data: any) => {
  return (
    data?.data?.accessToken ||
    data?.data?.token ||
    data?.accessToken ||
    data?.token ||
    ""
  );
};

export default function BusinessOnboarding() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [publishedData, setPublishedData] = useState<any>(null);

  /* ================= OTP STATES ================= */

  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  /* ================= GLOBAL FORM DATA ================= */

  const [formData, setFormData] = useState({
    user: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      profileUrl: "",
      profilePreviewUrl: "",
      profileFile: undefined as File | undefined,
    },

    tenant: {
      name: "",
      bio: "",
      logoUrl: "",
      logoPreviewUrl: "",
      logoFile: undefined as File | undefined,
    },

    restaurant: {
      name: "",
      slug: "",
      tagline: "",
      logoUrl: "",
      logoPreviewUrl: "",
      logoFile: undefined as File | undefined,
      supportContact: {
        email: "",
        whatsapp: "",
        phone: "",
      },
      branding: {
        primaryColor: "#e4002b",
        secondaryColor: "#ffffff",
        fontFamily: "Poppins",
      },
    },

    branch: {
      name: "",
      description: "",
      coverImage: "",
      coverImagePreviewUrl: "",
      coverImageFile: undefined as File | undefined,
      address: {
        street: "",
        area: "",
        city: "",
        state: "",
        country: "Pakistan",
        lat: "",
        lng: "",
      },

      settings: {
        taxPercentage: 0,
        isFreeDelivery: false,
        freeDeliveryThreshold: 0,
        deliveryFee: 0,
        minOrderAmount: 0,
        radiusKm: 0,
        allowedOrderTypes: [],
        allowedPaymentMethods: [],
        autoAcceptOrders: false,
        estimatedPrepTime: 0,
      },
    },
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [activeStep, showOtpVerification]);

  /* ================= DERIVED VALUES ================= */

  const activeIndex = steps.findIndex((s) => s.id === activeStep);

  const verificationEmail = useMemo(() => {
    return normalizeEmail(otpEmail || formData.user.email);
  }, [otpEmail, formData.user.email]);

  const cleanedOtp = useMemo(() => {
    return otp.replace(/\D/g, "").slice(0, 6);
  }, [otp]);

  const isOtpValid = cleanedOtp.length >= 4;

  /* ================= UPDATE HELPER ================= */

  const updateFormData = (section: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        ...data,
      },
    }));
  };

  const startOtpVerification = ({
    email,
    token,
    step = 4,
  }: {
    email: string;
    token?: string;
    step?: number;
  }) => {
    const normalized = normalizeEmail(email);

    setOtp("");
    setOtpEmail(normalized);
    setShowOtpVerification(true);
    setActiveStep(step);

    if (token) {
      setAccessToken(token);
      localStorage.setItem("tenantSignupToken", token);
    }
  };

  const resetOtpVerification = () => {
    setOtp("");
    setOtpEmail("");
    setAccessToken("");
    setShowOtpVerification(false);
    localStorage.removeItem("tenantSignupToken");
    setActiveStep(1);
  };

  /* ================= API SUBMISSION ================= */

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      user: {
        email: normalizeEmail(formData.user.email),
        password: formData.user.password,
        firstName: formData.user.firstName,
        lastName: formData.user.lastName,
        avatarUrl: formData.user.profileUrl,
        bio: "",
      },
      tenant: {
        name: formData.tenant.name,
        slug: formData.restaurant.slug,
        logoUrl: formData.tenant.logoUrl,
        bio: formData.tenant.bio,
        socialLinks: {},
        settings: {},
      },
      restaurant: {
        name: formData.restaurant.name,
        slug: formData.restaurant.slug,
        logoUrl: formData.restaurant.logoUrl,
        customDomain: "",
        bio: "",
        tagline: formData.restaurant.tagline,
        supportContact: formData.restaurant.supportContact,
        branding: formData.restaurant.branding,
        socialMedia: {},
      },
      branch: {
        name: formData.branch.name,
        street: formData.branch.address.street,
        city: formData.branch.address.city,
        state: formData.branch.address.state,
        country: formData.branch.address.country,
        area: formData.branch.address.area,
        coverImage: formData.branch.coverImage,
        description: formData.branch.description,
        lat: formData.branch.address.lat
          ? String(formData.branch.address.lat)
          : "0",
        lng: formData.branch.address.lng
          ? String(formData.branch.address.lng)
          : "0",
        settings: {
          allowedOrderTypes: formData.branch.settings.allowedOrderTypes,
          allowedPaymentMethods: formData.branch.settings.allowedPaymentMethods,
        },
      },
    };

    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/register-tenant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (isUserAlreadyExistsError(data)) {
          const tokenFromError = extractAccessToken(data);

          startOtpVerification({
            email: formData.user.email,
            token: tokenFromError,
            step: 1,
          });

          toast.info("User already exists. Please verify the OTP sent to your email.");
          return;
        }

        toast.error(data?.message || "Failed to register");
        return;
      }

      const token = extractAccessToken(data);

      const { accessToken: _accessToken, token: _token, ...rest } =
        data?.data || {};

      setPublishedData(rest);

      if (!token) {
        toast.error("Access token not received");
        return;
      }

      startOtpVerification({
        email: formData.user.email,
        token,
        step: 4,
      });

      toast.success("Registration successful! Please verify OTP.");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY EMAIL ================= */

  const handleVerifyOtp = async () => {
    if (!cleanedOtp) {
      toast.error("Please enter OTP");
      return;
    }

    if (!isOtpValid) {
      toast.error("Please enter a valid OTP");
      return;
    }

    const token = accessToken || localStorage.getItem("tenantSignupToken");

    setOtpLoading(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}/v1/auth/verify-email`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          otp: cleanedOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message ||
            data?.error?.message ||
            "OTP verification failed"
        );
      }

      toast.success("Email verified successfully!");

      localStorage.removeItem("tenantSignupToken");

      setShowOtpVerification(false);
      setOtp("");
      setOtpEmail("");
      setAccessToken("");

      setActiveStep(5);
    } catch (error: any) {
      toast.error(error?.message || "Verification failed");
    } finally {
      setOtpLoading(false);
    }
  };

  /* ================= OTP VIEW ================= */

  const renderOtpVerification = () => {
    return (
      <div className="max-w-lg mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <span className="text-primary text-2xl font-semibold">@</span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            Verify Email
          </h2>

          <p className="text-sm text-gray-500 mt-2 leading-6">
            Enter the OTP sent to your email address to continue your business
            onboarding.
          </p>

          <div className="mt-4 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-500">OTP sent to</p>
            <p className="text-sm font-semibold text-gray-900 break-all mt-1">
              {verificationEmail || "your email address"}
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-800">
              Enter OTP
            </label>

            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Enter OTP"
              value={cleanedOtp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !otpLoading && isOtpValid) {
                  handleVerifyOtp();
                }
              }}
              className="mt-2 text-center tracking-[0.35em] font-semibold"
            />

            <p className="text-xs text-gray-500 mt-2">
              Please check your inbox or spam folder for the verification code.
            </p>
          </div>

          <Button
            onClick={handleVerifyOtp}
            disabled={otpLoading || !isOtpValid}
            className="w-full py-5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {otpLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={resetOtpVerification}
            disabled={otpLoading}
            className="w-full py-5 rounded-xl"
          >
            Change Email
          </Button>
        </div>
      </div>
    );
  };

  /* ================= RENDER STEP ================= */

  const renderStepContent = () => {
    if (showOtpVerification) {
      return renderOtpVerification();
    }

    switch (activeStep) {
      case 1:
        return (
          <UserInfoStep
            formData={formData}
            updateFormData={updateFormData}
            next={() => setActiveStep(2)}
          />
        );

      case 2:
        return (
          <TenantInfoStep
            formData={formData}
            updateFormData={updateFormData}
            next={() => setActiveStep(3)}
            back={() => setActiveStep(1)}
          />
        );

      case 3:
        return (
          <BranchStep
            formData={formData}
            updateFormData={updateFormData}
            next={() => setActiveStep(4)}
            back={() => setActiveStep(2)}
          />
        );

      case 4:
        return (
          <SettingsStep
            formData={formData}
            updateFormData={updateFormData}
            next={handleSubmit}
            back={() => setActiveStep(3)}
            isLoading={loading}
          />
        );

      case 5:
        return (
          <StorePublished formData={formData} publishedData={publishedData} />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-10 py-10">
      {/* HEADER */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Business Onboarding
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Complete the steps below to set up your business
        </p>
      </div>

      {/* STEPPER */}
      <div className="max-w-5xl mx-auto mb-10 relative overflow-x-auto">
        <div className="flex items-center justify-between relative min-w-[500px] sm:min-w-full">
          <div className="absolute top-5 left-0 w-full border-t border-dashed border-[#909090]" />

          <div
            className="absolute top-5 left-0 border-t border-dashed border-primary z-0"
            style={{
              width: `${((activeIndex + 0.5) / steps.length) * 100}%`,
            }}
          />

          {steps.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isActive = step.id === activeStep;

            return (
              <div
                key={step.id}
                className="relative z-10 flex flex-col items-center flex-1 min-w-[60px]"
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold
                  ${
                    isCompleted || isActive
                      ? "bg-primary text-white"
                      : "bg-white border border-[#909090] text-[#909090]"
                  }`}
                >
                  {isCompleted ? "✓" : step.id}
                </div>

                <span
                  className={`mt-2 text-[9px] sm:text-xs text-center
                  ${isActive ? "text-primary font-medium" : "text-[#909090]"}`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP CONTENT */}
      <div className="mt-8">{renderStepContent()}</div>
    </div>
  );
}