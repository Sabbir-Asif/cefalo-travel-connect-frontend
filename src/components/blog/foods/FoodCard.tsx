import type { Food } from "../../../types/Food";

interface FoodCardPropTypes {
    blogId: string,
    food: Food,
    onDelete: (id: string) => void;
}

const FoodCard: React.FC<FoodCardPropTypes> = ({ blogId, food, onDelete }) => {
    return (
        <div>
            
        </div>
    );
};

export default FoodCard;