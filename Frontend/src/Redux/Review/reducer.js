// import {
//     FETCH_REVIEWS_REQUEST,
//     FETCH_REVIEWS_SUCCESS,
//     FETCH_REVIEWS_FAILURE,
//     CREATE_REVIEW_REQUEST,
//     CREATE_REVIEW_SUCCESS,
//     CREATE_REVIEW_FAILURE,
//     UPDATE_REVIEW_REQUEST,
//     UPDATE_REVIEW_SUCCESS,
//     UPDATE_REVIEW_FAILURE,
//     DELETE_REVIEW_REQUEST,
//     DELETE_REVIEW_SUCCESS,
//     DELETE_REVIEW_FAILURE,
//   } from "./actionTypes";
  
  
  
//   const initialState = {
//     reviews: [],
//     loading: false,
//     error: null,
//   };
  
//   const reviewReducer = (state = initialState, action) => {
//     switch (action.type) {
//       case FETCH_REVIEWS_REQUEST:
//       case CREATE_REVIEW_REQUEST:
//       case UPDATE_REVIEW_REQUEST:
//       case DELETE_REVIEW_REQUEST:
//         return { ...state, loading: true, error: null };
  
//       case FETCH_REVIEWS_SUCCESS:
//         return { ...state, loading: false, reviews: action.payload };
  
//       case CREATE_REVIEW_SUCCESS:
//         return { ...state, loading: false, reviews: [...state.reviews, action.payload] };
  
//       case UPDATE_REVIEW_SUCCESS:
//         return {
//           ...state,
//           loading: false,
//           reviews: state.reviews.map((review) =>
//             review.id === action.payload.id ? action.payload : review
//           ),
//         };
  
//       case FETCH_REVIEWS_SUCCESS:
//   return { 
//     ...state, 
//     loading: false, 
//     reviews: Array.isArray(action.payload) ? action.payload : [action.payload] 
//   };

  
//       case FETCH_REVIEWS_FAILURE:
//       case CREATE_REVIEW_FAILURE:
//       case UPDATE_REVIEW_FAILURE:
//       case DELETE_REVIEW_FAILURE:
//         return { ...state, loading: false, error: action.payload };
  
//       default:
//         return state;
//     }
//   };
  
//   export default reviewReducer;
  

import {
  FETCH_REVIEWS_REQUEST,
  FETCH_REVIEWS_SUCCESS,
  FETCH_REVIEWS_FAILURE,
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAILURE,
  UPDATE_REVIEW_REQUEST,
  UPDATE_REVIEW_SUCCESS,
  UPDATE_REVIEW_FAILURE,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAILURE,
} from "./actionTypes";

const initialState = {
  reviews: [],
  ratings: {},   // ✅ Add ratings object
  loading: false,
  error: null,
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REVIEWS_REQUEST:
    case CREATE_REVIEW_REQUEST:
    case UPDATE_REVIEW_REQUEST:
    case DELETE_REVIEW_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_REVIEWS_SUCCESS:
      return { 
        ...state, 
        loading: false, 
        reviews: Array.isArray(action.payload) ? action.payload : [action.payload] 
      };

    case "FETCH_MULTIPLE_RATINGS_SUCCESS":   // ✅ Handle multiple ratings
      return {
        ...state,
        ratings: action.payload,
      };

    case CREATE_REVIEW_SUCCESS:
      return { ...state, loading: false, reviews: [...state.reviews, action.payload] };

    case UPDATE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        reviews: state.reviews.map((review) =>
          review.id === action.payload.id ? action.payload : review
        ),
      };

    case DELETE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        reviews: state.reviews.filter((r) => r.id !== action.payload),
      };

    case FETCH_REVIEWS_FAILURE:
    case CREATE_REVIEW_FAILURE:
    case UPDATE_REVIEW_FAILURE:
    case DELETE_REVIEW_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default reviewReducer;
