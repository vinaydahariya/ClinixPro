import React, { useEffect } from "react";
import { services } from "../../../Data/Services";
import HomeServiceCard from "./HomeServiceCard";
import ClinicList from "../Clinic/ClinicList";
import Banner from "./Banner";
import { useDispatch, useSelector } from "react-redux";
import { fetchClinics } from "../../../Redux/Clinic/action";

const Home = () => {
  const { clinic } = useSelector((store) => store);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClinics());
  }, []);
  return (
    <div className="space-y-20 ">
      <section>
        <Banner />
      </section>
      <section className="space-y-10 lg:space-y-0 lg:flex items-center gap-5 px-20">
        <div className="w-full lg:w-1/2 ">
          <h1 className="text-2xl font-semibold pb-9">
            What are you looking for, Bestie? 👀
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-5">
            {services.map((item) => (
              <HomeServiceCard key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2 border grid gap-3 grid-cols-2 grid-rows-12 h-[45vh] md:h-[90vh]">
          <div className="row-span-7">
            <img
              className="h-full w-full rounded-md"
              src="/photos/homePage/h1.jpg"
              alt=""
            />
          </div>
          <div className="row-span-5">
            <img
              className="h-full w-full rounded-md"
              src="/photos/homePage/h2.jpg"
              alt=""
            />
          </div>
          <div className="row-span-7">
            <img
              className="h-full w-full rounded-md"
              src="/photos/homePage/h3.jpg"
              alt=""
            />
          </div>
          <div className="row-span-5">
            <img
              className="h-full w-full rounded-md"
              src="/photos/homePage/h4.jpg"
              alt=""
            />
          </div>
        </div>
      </section>
      <section className="px-20">
        <h1 className="text-3xl font-bold pb-10 ">Book Your Favorite Clinic</h1>
        <ClinicList clinics={clinic.clinics} />
      </section>
    </div>
  );
};

export default Home;
