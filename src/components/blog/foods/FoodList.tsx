// import { useEffect, useState } from "react";
// import { useParams } from "react-router";
// import type { Food } from "../../../types/Food";
// import { getFoodsForBlogAPI } from "../../../utils/api/blog";
// import FoodCard from "./FoodCard";
// import CreateFoodModal from "./CreateFoodModal";

// const FoodList = () => {
//     const { blogId } = useParams();
//     const [foods, setfoods] = useState<Food[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [showModal, setShowModal] = useState(false);

//     useEffect(() => {
//         if (!blogId) return;

//         const fetchData = async () => {
//             setLoading(true);
//             const data = await getFoodsForBlogAPI(blogId);
//             setfoods(data);
//             setLoading(false);
//         }

//         fetchData();
//     }, [blogId])

//     const handleDelete = (deletedId: string) => {
//         setFoods((prev) => prev.filter(a => a.id !== deletedId));
//     };

//     if (loading) {
//         return <div>
//             Loading...
//         </div>
//     }

//     return (
//         <div>
//             <div className="flex justify-start mb-4">
//                 <button className="btn btn-primary" onClick={() => setShowModal(true)}>
//                     + Add Food
//                 </button>
//             </div>

//             {foods.length === 0 ? (
//                 <div>
//                     No Accommodation for this plan.
//                 </div>
//             ) : (
//                 <div className="space-y-2 grid grid-cols-2 gap-2">
//                     {foods.map((food) => (
//                         <FoodCard
//                             key={food.id}
//                             blogId={blogId!}
//                             food={food}
//                             onDelete={handleDelete}
//                         />
//                     ))}
//                 </div>
//             )}

//             {showModal && blogId && (
//                 <CreateFoodModal
//                     blogId={blogId}
//                     onClose={() => setShowModal(false)}
//                     onAdd={handleAddLodge}
//                 />
//             )}
//         </div>
//     );
// };

// export default FoodList;