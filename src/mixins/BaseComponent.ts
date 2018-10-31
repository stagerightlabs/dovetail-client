import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class HandleResponseErrors extends Vue {
    public handleResponseErrors(error: any) {

        // Ensure we have a valid error object
        if (typeof error === 'undefined') {
            return;
        }

        // Ensure we have the response
        if (! error.hasOwnProperty('response')) {
            return;
        }

        // Ensure we have the response data
        if (! error.response.hasOwnProperty('data')) {
            return;
        }

        // If the response data has an error set, capture
        // capture the validation messages
        if (error.response.data.hasOwnProperty('errors')) {
            // handle validation message set
            Object.keys(error.response.data.errors).forEach((key) => {
                // console.log(key, error.response.data.errors[key].shift());
                this.$validator.errors.add({
                    field: key,
                    msg: error.response.data.errors[key].shift()
                })
            });
        } else if (error.data.hasOwnProperty('message')) {
            // Notify the user of this message
        }
    }
}
