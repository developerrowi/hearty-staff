import Auth from "./components/auth.svelte";
import Login from "./routes/login/login.svelte";
import Bucket from "./routes/bucket/bucket.svelte";
import BucketList from "./routes/bucket/bucket-list.svelte";
import CheckLists from "./routes/check-list/check-lists.svelte";
import CheckListItems from "./routes/check-list/check-list-items.svelte";
import Itinerary from "./routes/itinerary/itinerary.svelte";
import PictureView from "./routes/picture-view/picture-view.svelte";
import TopCountries from "./routes/top-countries/top-countries.svelte";
import Plan from "./routes/plan/plan.svelte";
import Signup from "./routes/signup/signup.svelte";
import Profile from "./routes/profile/profile.svelte";
import ViewMap from "./routes/view-map/view-map.svelte";
import Home from "./routes/home/home.svelte"
import Invoice from "./routes/invoice/invoice.svelte"
import AddItinerary from "./routes/add-itinerary/add-itinerary.svelte";
import CountryInfo from "./routes/country-info/country-info.svelte";
import TripPlan from "./routes/trip-plan/trip-plan.svelte";
import ResetPassword from "./routes/reset-password/reset-password.svelte";
import ResetPasswordUser from "./routes/reset-password/reset-password-user.svelte";

export default [
  {
    path: "/",
    component: Invoice
  },
  {
    path: "/invoice",
    component: Invoice
  },


  //public routes
  {
    path: "/login",
    component: Login,
    public: true
  },
  {
    path: "/sign-up",
    component: Signup,
    public: true
  },


];
