import { Link } from "react-router-dom";

// Entry point to the Admin Dashboard, rendered at the top of the My Events / My Groups
// pages. Extracted so the two pages share one styled link (no copy-pasted classes).
export default function AdminDashboardLink() {
    return (
        <div className="w-full px-4 pt-4">
            <Link
                to="/admin"
                data-testid="adminDashboardLink"
                className="inline-flex items-center rounded-full bg-[#55a8c2] px-5 py-2 text-sm font-bold text-white hover:opacity-90"
            >
                Go to Admin Dashboard
            </Link>
        </div>
    );
}
