"use client";
import React, { MouseEventHandler } from "react";
import IcnSpinner from "@/public/icons/icn-spinner.svg";

import cn from "@/utils/cn";

export interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  outlined?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler;
  fullWidth?: boolean;
  kind?: "primary" | "secondary";
  size?: "medium" | "small";
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  disabled,
  fullWidth,
  kind = "primary",
  loading,
  onClick,
  outlined,
  size = "medium",
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={cn(
        `rounded-lg text-base inline-flex justify-center relative transition-all border border-transparent`,
        className,
        {
          "font-medium px-4 py-1": size === "medium",
          "bg-slate-900 border-slate-900 text-white hover:enabled:text-primary-300 hover:enabled:bg-slate-800 hover:enabled:border-slate-800":
            kind === "primary",
          "opacity-60 cursor-not-allowed": kind === "primary" && !!disabled,
          "cursor-progress": !!loading,
          "w-full": fullWidth,
        }
      )}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {loading ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <IcnSpinner
            className={cn(`w-[20px] animate-spin`, {
              "fill-white": kind === "primary",
            })}
          />
        </div>
      ) : null}{" "}
      <div
        className={cn({
          invisible: loading,
        })}
      >
        {children}
      </div>
    </button>
  );
};

export default Button;
