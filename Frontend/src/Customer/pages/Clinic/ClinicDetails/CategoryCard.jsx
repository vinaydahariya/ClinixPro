import React from 'react'

const CategoryCard = ({handleSelectCategory,item,selectedCategory}) => {
  return (
    <div
    onClick={handleSelectCategory(item.id)}
    className={`px-3 py-2 cursor-pointer flex gap-2 items-center ${
      selectedCategory === item.id
        ? "bg-primary-color text-white rounded-md"
        : ""
    }`}
  >
    <img
      className="w-14 h-14 object-cover rounded-full"
      src={item.image}
      alt=""
    />
    <h1>{item.name}</h1>
  </div>
  )
}

export default CategoryCard