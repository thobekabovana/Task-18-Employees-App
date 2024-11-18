import React from 'react'
import Navbar from './Navigation'
import Footer from './Footer'
import { Outlet, Link } from 'react-router-dom'

export default function Layout() {
  return (
    <>

       <Navbar/>
        <Outlet/>
      <Footer/>

    </>
  )
}
