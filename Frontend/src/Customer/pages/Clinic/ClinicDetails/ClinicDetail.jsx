import React from 'react'
import { useSelector } from 'react-redux'

const ClinicDetail = () => {
    const {clinic}=useSelector(store=>store)
  return (
    <div className="space-y-5 mb-20">
    <section className="grid grid-cols-2  gap-3">
      <div className="col-span-2">
        <img
          className="w-full rounded-md h-[15rem] object-cover"
          src={clinic.clinic?.images[0]}
          alt=""
        />
      </div>
      <div className="col-span-1">
        <img
          className="w-full  rounded-md h-[15rem] object-cover"
          src={clinic.clinic?.images[1]}
          alt=""
        />
      </div>
      <div className="col-span-1">
        <img
          className="w-full  rounded-md h-[15rem] object-cover"
          src={clinic.clinic?.images[2]}
          alt=""
        />
      </div>
    </section>


      <div className="space-y-3">
        <h1 className="font-bold text-3xl">{clinic.clinic?.name} </h1>
        <p>
          {clinic.clinic?.address}, {clinic.clinic?.city}
        </p>
        <p>
          <strong>Timing :</strong> {clinic.clinic?.openTime} To{" "}
          {clinic.clinic?.closeTime}
        </p>
      </div>
  
  </div>
  )
}

export default ClinicDetail