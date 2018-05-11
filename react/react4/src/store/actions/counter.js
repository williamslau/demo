import * as types from '../action-types';
let action = {
    add(count) {
        return { type: types.INCREMENT, count }
    },
    minus(count) {
        console.log(count);
        return { type: types.DECREMENT, count }
    }
}
export default action;