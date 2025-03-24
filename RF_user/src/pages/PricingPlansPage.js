// //
// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from '../redux/store';
// import { getPrices } from '../redux/slices/price';

// export default function pricingPlans() {
//     useEffect(() => {
//         dispatch(getPrices());
//     }, [dispatch]);

//     useEffect(() => {
//         if (price) setTableData(price);
//     }, [price]);
//     const { price } = useSelector((state) => state.price);
//     return(
//         {
//             subscription: 'Professional',
//             price: 300,
//             caption: 'forever',
//             lists: [
//                 { text: '3 prototypes', isAvailable: true },
//                 { text: '3 boards', isAvailable: true },
//                 { text: 'Up to 5 team members', isAvailable: false },
//                 { text: 'Advanced security', isAvailable: false },
//                 { text: 'Permissions & workflows', isAvailable: false },
//             ],
//             labelAction: 'current plan',
//         },
//         {
//             subscription: 'ProfessionalPlus',
//             price: 500,
//             caption: 'saving $24 a year',
//             lists: [
//                 { text: '3 prototypes', isAvailable: true },
//                 { text: '3 boards', isAvailable: true },
//                 { text: 'Up to 5 team members', isAvailable: true },
//                 { text: 'Advanced security', isAvailable: false },
//                 { text: 'Permissions & workflows', isAvailable: false },
//             ],
//             labelAction: 'choose starter',
//         },
//         {
//             subscription: 'Diamond',
//             price: 700,
//             caption: 'saving $124 a year',
//             lists: [
//                 { text: '3 prototypes', isAvailable: true },
//                 { text: '3 boards', isAvailable: true },
//                 { text: 'Up to 5 team members', isAvailable: true },
//                 { text: 'Advanced security', isAvailable: true },
//                 { text: 'Permissions & workflows', isAvailable: true },
//             ],
//             labelAction: 'choose premium',
//         },
//     )
// }
