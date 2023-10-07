import { useState } from 'react';
import { NavList } from '../data/Navlist';

function Sidenav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className='flex flex-row bg-black'>
        <div className='basis-11/12'>Items</div>
        <button onClick={toggleNav}>{isOpen?"<<":">>"}</button>
      </div>
      <ul>
        {NavList.map((item) => {
          return <li key={item.id}>{item.name}</li>
        })}
      </ul>
    </>
  );
}

export default Sidenav;
