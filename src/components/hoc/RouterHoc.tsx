const RouterHoc = ({children}: { children: any }) => {
    // const {
    //     menus
    // } = useSelector((state: any) => state.layoutSlice);
    // const {pathname} = useLocation();
    // const dispatch = useDispatch();
    //
    // useLayoutEffect(() => {
    //     document.documentElement.scrollTo(0, 0);
    //     menus.forEach((item: { route: any; }, index: any) => {
    //         if (pathname === `/${item.route}`)
    //             dispatch(updatePosition(index));
    //     });
    //     if (pathname === "/login") {
    //         dispatch(updateShowLayout(false))
    //     } else {
    //         dispatch(updateShowLayout(true))
    //     }
    // }, [pathname]);
    return children;
};

export default RouterHoc;