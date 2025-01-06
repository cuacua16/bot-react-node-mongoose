import React, {useEffect} from 'react'
import {useNavigate} from 'react-router';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/orders")
  }, [])
  
  return (
    <div></div>
  )
}

export default Index