import { User } from "@/types/type";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAge(dob: string | Date) {
  var today = new Date();
  var birthDate = new Date(dob);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age ? age?.toString() : age;
}

export const formatAmount = (amount: number): string => {
  if (amount === undefined || amount === null) {
      return '0.00';
  }
  return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};


export const downloadCSV = (users: User[]) => {
  // Define the headers for the CSV
  const headers = [
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Role',
    'Is Verified',
    'Is Active',
    'Created At'
  ];

  // Convert user data to CSV rows
  const userDataCsv = users.map((user) => [
    user.firstName || '',
    user.lastName || '',
    user.email,
    user.phone || '',
    user.role === 2 ? 'User' : 'Service Provider',
    user.isVerified ? 'Yes' : 'No',
    user.isActive ? 'Yes' : 'No',
    new Date(user.createdAt).toLocaleDateString()
  ]);

  // Combine headers and user data
  const csvContent = [
    headers.join(','),
    ...userDataCsv.map(row => row.join(','))
  ].join('\n');

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  // Create a link element and trigger the download
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'users.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

};

function convertToSubcurrency(amount: number, factor = 100) {
  return Math.round(amount * factor);
}

export default convertToSubcurrency;

