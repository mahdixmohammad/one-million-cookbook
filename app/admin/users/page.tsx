import UsersTable from "@/components/admin/UsersTable";

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
    cache: "no-store",
  });

  const usersData = await res.json();

  type UserData = {
    active: boolean;
    completions: number;
    disconnected: boolean;
    email: string;
    lastLogin: string;
    role: string;
    username: string;
  };

  type UserTuple = [string, UserData];
  const users: UserTuple[] = Object.entries(usersData);

  return <UsersTable users={users} />;
}
