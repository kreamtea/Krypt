import { useState } from 'react';
// importing some icons
import {HiMenu, HiMenuAlt4} from 'react-icons/hi'; 
import {AiOutlineClose} from 'react-icons/ai';

//importing logo
import logo from '../../images/logo.png';

// resuable list item component
const NavbarItem = ({title, classProps}) => {
    return(
        <li className= {`mx-4 cursor-pointer text-white ${classProps}`}>
            {title}
        </li>
    );
}

//main navbar component
const Navbar = () => {
    const [toggleMenu, setToggleMenu] = useState(false); //using useState to track if the mobile menu is open of not
    return(
        //navbar container
        <nav className='w-full flex md:justify-center justify-between items-center p-4'>
            {/* logo section*/}
            <div className='md:flex-[0.5] flex-initial justify-center items-center'>
                <img src={logo} alt="logo" className='w-32 cursor-pointer' />
            </div>
            
            {/* menu items for desktop view */}
            <ul className='md:flex text-white hidden list-none flex-row justify-between items-center flex-initial'>
                {["Market", "Exchange", "Tutorial", "Wallets"].map((item, index) => (
                    <NavbarItem key={item + index} title={item} />
                ))}
                <li className='bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]'>
                    Login
                </li>
            </ul>

            {/* menu toggle mobile */}
            <div className='flex relative'>
                {toggleMenu
                 ? <AiOutlineClose fontSize={28} className='text-white md:hidden cursor-pointer 'onClick={() => setToggleMenu(false)}/>
                 : <HiMenuAlt4 fontSize={28} className='text-white md:hidden cursor-pointer 'onClick={() => setToggleMenu(true)}/>
                 }
                 {/* mobile menu drawer */}
                 {toggleMenu && (
                    <ul  
                    className='z-10 fixed top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none 
                    flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in'>
                        <li className='text-xl w-full my-2'>
                            <AiOutlineClose  onClick={() => {setToggleMenu(false)}}/>
                        </li>
                        {["Market", "Exchange", "Tutorial", "Wallets"].map((item, index) => (
                        <NavbarItem key={item + index} title={item} classProps='my-2 text-lg'/>
                         ))}
                    </ul>
                 )}
            </div>
        </nav>
    );
}

export default Navbar;