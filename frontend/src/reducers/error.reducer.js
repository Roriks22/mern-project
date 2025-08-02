import { GET_POSTS_ERRORS } from "../actions/post.actions";

const initialState = { userError: {}, postError: {} };

export default function errorReducer(state = initialState, action) {
  switch (action.type) {
    case GET_POSTS_ERRORS:
      return {
        ...state,
        postError: action.payload,
      };
    default:
      return state;
  }
}
