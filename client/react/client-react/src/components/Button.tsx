// import React from "react";
// // import { cn } from "@/lib/utils";
// import classnames from "classnames";

// interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: "primary" | "secondary" | "outline";
//   size?: "sm" | "md" | "lg";
//   children: React.ReactNode;
// }

// const Button: React.FC<ButtonProps> = ({
//   variant = "primary",
//   size = "md",
//   className,
//   children,
//   ...props
// }) => {
//   return (
//     <button
//       className={classnames(
//         "font-medium rounded-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50",
//         {
//           "bg-primary text-white hover:bg-primary/90": variant === "primary",
//           "bg-white text-black hover:bg-gray-100": variant === "secondary",
//           "bg-transparent border border-white text-white hover:bg-white/10":
//             variant === "outline",
//         },
//         {
//           "text-sm px-4 py-1.5": size === "sm",
//           "px-6 py-2.5": size === "md",
//           "text-lg px-8 py-3": size === "lg",
//         },
//         className
//       )}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// export default Button;
