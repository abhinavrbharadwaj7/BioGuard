export const ROLES = ["vendor", "admin", "tenant"];

export const ROLE_HOME = {
  vendor: "/vendor",
  admin: "/admin",
  tenant: "/tenant",
};

export const ROLE_LABELS = {
  vendor: "Vendor",
  admin: "Admin",
  tenant: "Tenant",
};

export function getRoleHome(role) {
  return ROLE_HOME[role] || "/login";
}

export function isValidRole(role) {
  return ROLES.includes(role);
}
