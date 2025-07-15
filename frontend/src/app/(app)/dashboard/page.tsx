import Header from "./components/Header";
import Banner from "./components/Banner";
import PopularEvents from "./components/PopularEvents";
import AllEvents from "./components/AllEvents";
export default function DashboardPage() {
  return <div>
    <Header />
    <Banner />
    {/* <PopularEvents /> */}
    <AllEvents />
  </div>;
}
