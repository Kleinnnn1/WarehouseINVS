import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../service/supabaseClient";

function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setLoading(false);
        };
        getSession();
    }, []);

    if (loading) return <p className="text-center mt-20">Loading...</p>;
    if (!session) return <Navigate to="/" replace />;

    return children;
}

export default ProtectedRoute;
