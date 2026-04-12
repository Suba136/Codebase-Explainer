import React from 'react'
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
        <navbar>

        </navbar>

        <main>
            <Outlet />
        </main>

        <footer>

        </footer>
    </>
  )
}

export default Layout