// src/api/StocksApi.js
import { supabase } from "../service/supabaseClient";

//items api
export const fetchItems = async () => {
    const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("id", { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
};

// activity logs api
export const fetchActivityLogs = async () => {
    const { data, error } = await supabase
        .from("activity_logs")
        .select(`
            id,
            item_id,
            quantity,
            action_type,
            reason,
            issued_to,
            issued_at,
            items (name)
        `)
        .order("issued_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map(log => ({
        id: log.id,
        item: log.items?.name || "Unknown Item",
        action: `${log.action_type === "take" ? "Taken" : "Added"} by ${log.issued_to}`,
        quantity: log.quantity,
        timestamp: new Date(log.issued_at).toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }),
        reason: log.reason,
    }));
};


//takeitem api
export const takeItem = async ({ itemId, newStock, issuedTo, issuedAt, reason, quantity }) => {
    // 1. Update stock
    const { data: updatedItem, error: updateError } = await supabase
        .from("items")
        .update({ stock: newStock })
        .eq("id", itemId)
        .select()
        .single();

    if (updateError) {
        throw new Error("Failed to update stock: " + updateError.message);
    }

    // 2. Insert log
    const { error: logError } = await supabase.from("activity_logs").insert({
        item_id: itemId,
        issued_to: issuedTo,
        issued_at: issuedAt,
        reason,
        quantity,
        action_type: "take",
    });

    if (logError) {
        throw new Error("Stock updated, but failed to log activity: " + logError.message);
    }

    return updatedItem;
};

//notification api
export const fetchNotifications = async () => {
    const { data, error } = await supabase
        .from("notification")
        .select("id, message, mark, created_at")
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
};

//mark notification api
export const markNotificationAsRead = async (id) => {
    const { error } = await supabase
        .from("notification")
        .update({ mark: true })
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
};


// register api
export const registerUser = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) throw error;
    return data;
};


// login api
export const loginUser = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
};

// logout api
export const logoutUser = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error("Failed to logout: " + error.message);
};
