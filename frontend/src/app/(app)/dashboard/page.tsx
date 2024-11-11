import Header from "./components/Header";
import Banner from "./components/Banner";
import PopularEvents from "./components/PopularEvents";
export default function DashboardPage() {
  return <div>
    {/* header */}
    <Header />
    {/* banner */}
    <Banner />
    {/* filters for events */}
    <PopularEvents />
    {/* events list */}
  </div>;
}
