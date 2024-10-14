export const Chips = ({
    id,
    index,
    text,
    selected,
    isMultipleSelected,
    isSubCategory,
    hideCross,
    isDeleteId,
    isNested,
    level,
    onSubCategoryClick,
    onKeywordClick,
    currentSelected,
    onNestedClick,
  }: {
    id: string;
    index: number;
    text: string;
    selected?: number | number[];
    isMultipleSelected?: boolean;
    isSubCategory: boolean;
    hideCross?: boolean;
    isDeleteId?: boolean;
    isNested?: boolean;
    level?: number;
    onSubCategoryClick?: (name: string) => void;
    onKeywordClick?: (index: number, name: string) => void;
    currentSelected?: (index: number) => void;
    onNestedClick?: (name: string, level: number) => void;
  }) => {

    const isSelected = Array.isArray(selected) ? selected.includes(index) : (isSubCategory && selected === index);
    return (
      <div 
        className={`${isSelected ? "bg-PrimaryColor text-white" : "bg-white"} relative inline-block px-4 py-3 m-2 shadow-custom border border-border rounded-md cursor-pointer`}
        onClick={() => (isSubCategory || isMultipleSelected) &&  currentSelected && currentSelected(index)}

      >
        <span>{text}</span>
        <svg
          onClick={() => {
            if (isSubCategory && onSubCategoryClick && !isDeleteId && !isNested) {
              onSubCategoryClick(text);
              console.log("f1", text);
            } else if (onKeywordClick) {
              onKeywordClick(index, text);
              console.log("f2", index, text);
            } else if (isDeleteId && onSubCategoryClick) {
              onSubCategoryClick(id);
              console.log("f3", id);
            } else if (isNested && onNestedClick && level !== undefined) {
              onNestedClick(text, level);
              console.log("f4", text, level);
            }
          }}
          xmlns="http://www.w3.org/2000/svg"
          className={hideCross ? "hidden" : "absolute top-0 right-0 cursor-pointer"}
          style={{ right: -10, top: -10 }}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
        >

          <circle cx="11" cy="11" r="11" fill="#FF5C5C" className={hideCross ? "hidden" : ""} />

          <path
            d="M13.9972 13.9133L8.22852 8.14453"
            stroke="#ffffff"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.9406 8.19824L8.14453 13.9943"
            stroke="#ffffff"
            stroke-width="1.5"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    );
  };