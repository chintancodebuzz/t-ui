import { twMerge } from "tailwind-merge"

/* Created a reusable Skeleton component that handles dark/light mode via the .skeleton class */
const Skeleton = ({ className, ...props }) => {
  return <div className={twMerge("skeleton", className)} {...props} />
}

export default Skeleton
