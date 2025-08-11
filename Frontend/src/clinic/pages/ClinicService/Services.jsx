import React, { useEffect } from 'react'
import ServicesTable from './ServicesTable'
import { useDispatch } from 'react-redux';
import { fetchClinicByOwner } from '../../../Redux/Clinic/action';


const Services = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchClinicByOwner(localStorage.getItem("jwt")));
  }, []);
  
  return (
    <div>
      <ServicesTable/>
    </div>
  )
}

export default Services