import style from "./nav-menu.module.css";

export const NavMenu = ({ onCategoryChange }) => {

  return (
    <>
      <nav className={style.NavMenuWrapper}>
        <div className={style.NavMenuItem} onClick={onCategoryChange}>
          Burgers
        </div>
        <div className={style.NavMenuItem} onClick={onCategoryChange}>
          Salats
        </div>
        <div className={style.NavMenuItem} onClick={onCategoryChange}>
          Snacks
        </div>
        <span className={style.NavMenuItem} onClick={onCategoryChange}>
          Drinks
        </span>
      </nav>
    </>
  );
};

export default NavMenu;
