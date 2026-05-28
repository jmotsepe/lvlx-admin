import { redirect } from "next/navigation";

const HomePage = async () => {
  return redirect("/dashboard");
};

export default HomePage;
