"use client";

import { useEffect, useState } from "react";

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

export default function BusinessOnboarding() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [publishedData, setPublishedData] = useState<any>(null);

  /* ================= OTP STATES ================= */

  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [otp, setOtp] = useState("");

  /* ================= GLOBAL FORM DATA ================= */

  const [formData, setFormData] = useState({
    user: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      profileUrl: "",
    },

    tenant: {
      name: "",
      bio: "",
      logoUrl: "",
    },

    restaurant: {
      name: "",
      slug: "",
      tagline: "",
      logoUrl: "",
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
  }, [activeStep]);

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

  const activeIndex = steps.findIndex((s) => s.id === activeStep);

  /* ================= API SUBMISSION ================= */

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      user: {
        email: formData.user.email,
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
        toast.error(data?.message || "Failed to register");
        return;
      }

      const { accessToken, ...rest } = data?.data;

      setPublishedData(rest);

      if (!accessToken) {
        toast.error("Access token not received");
        return;
      }

      /* ===== STORE TOKEN ===== */

      setAccessToken(accessToken);
      localStorage.setItem("tenantSignupToken", accessToken);

      toast.success("Registration successful! Please verify OTP");

      /* ===== SWITCH STEP 4 UI TO OTP ===== */

      setShowOtpVerification(true);

    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VERIFY EMAIL ================= */

  const handleVerifyOtp = async () => {
    const token = accessToken || localStorage.getItem("tenantSignupToken");

    if (!otp) {
      toast.error("Please enter OTP");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/v1/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          otp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "OTP verification failed");
      }

      toast.success("Email verified successfully!");

      localStorage.removeItem("tenantSignupToken");

      setActiveStep(5);

    } catch (error: any) {
      toast.error(error.message || "Verification failed");
    }
  };

  /* ================= RENDER STEP ================= */

  const renderStepContent = () => {
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
        /* ================= OTP VIEW ================= */

        if (showOtpVerification) {
          return (
            <div className="max-w-md mx-auto text-center space-y-4">

              <h2 className="text-lg font-semibold">Verify Email</h2>
              <p className="text-sm text-gray-500">
                Enter the OTP sent to your email
              </p>

              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <Button
                onClick={handleVerifyOtp}
                className="w-full py-4"
              >
                Verify OTP
              </Button>

            </div>
          );
        }

        /* ================= NORMAL STEP 4 ================= */

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
          <StorePublished
            formData={formData}
            publishedData={publishedData}
          />
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