"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import FormInput from "./FormInput";
import { Upload } from "lucide-react";
import { validateZod } from "@/hooks/useZodValidator";
import { userSchema } from "@/lib/RegisterSchemas";
import { useFileUpload } from "@/hooks/useFileUpload";

interface Props {
  formData: any;
  updateFormData: (section: string, data: any) => void;
  next: () => void;
}

export default function UserInfoStep({ formData, updateFormData, next }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
const [preview, setPreview] = useState<string | null>(null);
  /* ---------------- INPUT REFS (AUTO FOCUS) ---------------- */
const { uploadFile, uploading, progress } = useFileUpload();
console.log(formData);
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const blobUrl = URL.createObjectURL(file);

  updateFormData("user", {
    profileFile: file,
    profilePreviewUrl: blobUrl,
  });

  setPreview(blobUrl);

  setErrors((prev) => {
    const newErrors = { ...prev };
    delete newErrors.profileUrl;
    delete newErrors.profileFile;
    return newErrors;
  });

  const res = await uploadFile(e);

  if (res?.fileUrl) {
    updateFormData("user", {
      profileUrl: res.fileUrl,
    });
  }
};

  const inputRefs = {
    firstName: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
  };

  /* ---------------- CLEAR ERROR WHILE TYPING ---------------- */

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  /* ---------------- VALIDATE SINGLE FIELD (BLUR) ---------------- */

  const validateField = (field: string) => {
    const result = userSchema.safeParse(formData.user);

    if (!result.success) {
      const fieldError = result.error.issues.find(
        (err) => err.path[0] === field
      );

      setErrors((prev) => ({
        ...prev,
        [field]: fieldError?.message || "",
      }));
    }
  };


  /* ---------------- VALIDATION (NEXT STEP) ---------------- */

  const handleNext = () => {
    const { success, errors } = validateZod(userSchema, formData.user);

    if (!success) {
      setErrors(errors);

      const firstErrorField = Object.keys(errors)[0];

      if (
        firstErrorField &&
        inputRefs[firstErrorField as keyof typeof inputRefs]
      ) {
        inputRefs[
          firstErrorField as keyof typeof inputRefs
        ].current?.focus();
      }

      return;
    }

    setErrors({});
    next();
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl p-8">
      <h2 className="text-[20px] font-semibold text-gray-900 mb-6">
        User Info
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* FIRST NAME */}
        <div>
          <FormInput
            ref={inputRefs.firstName}
            label="First Name*"
            placeholder="Ahmed"
            value={formData.user.firstName || ""}
            onChange={(val: string) => {
              updateFormData("user", { firstName: val });
              clearError("firstName");
            }}
            onBlur={() => validateField("firstName")}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
          )}
        </div>

        {/* LAST NAME */}
        <div>
          <FormInput
            ref={inputRefs.lastName}
            label="Last Name*"
            placeholder="Ali"
            value={formData.user.lastName || ""}
            onChange={(val: string) => {
              updateFormData("user", { lastName: val });
              clearError("lastName");
            }}
            onBlur={() => validateField("lastName")}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
          )}
        </div>

        {/* EMAIL */}
        <div>
          <FormInput
            ref={inputRefs.email}
            label="Email*"
            placeholder="owner@indusfoods.com"
            value={formData.user.email || ""}
            onChange={(val: string) => {
              updateFormData("user", { email: val });
              clearError("email");
            }}
            onBlur={() => validateField("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* PHONE */}
        <div>
          <FormInput
            ref={inputRefs.phone}
            label="Phone Number*"
            placeholder="+923001234567"
            value={formData.user.phone || ""}
            onChange={(val: string) => {
              updateFormData("user", { phone: val });
              clearError("phone");
            }}
            onBlur={() => validateField("phone")}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div>
          <FormInput
            ref={inputRefs.password}
            label="Password*"
            placeholder="StrongPassword123!"
            value={formData.user.password || ""}
            onChange={(val: string) => {
              updateFormData("user", { password: val });
              clearError("password");
            }}
            onBlur={() => validateField("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* FILE UPLOAD */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Profile Photo (Optional)</label>

         <label className="flex items-center gap-4 cursor-pointer rounded-lg pt-1 hover:bg-gray-50 transition">

  {/* AVATAR BOX */}
  <div className="relative w-14 h-14">
    
    {/* 🔥 shimmer while uploading */}
    {uploading && (
      <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse" />
    )}

    {/* 🔥 image preview replaces icon */}
    {(preview || formData.user.profileUrl) ? (
      <img
        src={
           formData.user.profilePreviewUrl ||
      formData.user.profileUrl ||
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
        }
        alt="profile"
        className="w-14 h-14 rounded-full object-cover border"
      />
    ) : (
      <div className="w-14 h-14 border border-[#909090] rounded-full flex items-center justify-center">
        <Upload className="text-[#909090]" />
      </div>
    )}

    {/* 🔥 progress overlay */}
    {uploading && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
        <span className="text-white text-xs font-semibold">
          {progress}%
        </span>
      </div>
    )}
  </div>

  <div>
    <p className="text-sm font-medium">
      {uploading
        ? "Uploading..."
        : formData.user.profileUrl
        ? "Image uploaded"
        : "Choose File"}
    </p>

    <p className="text-xs text-[#909090]">
      PNG, JPG, JPEG upto 2MB
    </p>
  </div>

  <input
    type="file"
    accept=".png,.jpg,.jpeg"
    className="hidden"
    onChange={handleFileChange}
  />
</label>

          {errors.profileUrl && (
            <p className="text-red-500 text-xs">{errors.profileUrl}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-8">
   <Button
  onClick={handleNext}
  disabled={uploading}
  className="bg-primary hover:bg-red-800 px-6 py-2.5 rounded-[10px] disabled:opacity-50 disabled:cursor-not-allowed"
>
  {uploading ? "Uploading..." : "Save & Continue"}
</Button>
      </div>
    </div>
  );
}