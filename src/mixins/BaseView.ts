import Vue from 'vue';
import EventBus from '@/bus';
import { Alert, Model } from '@/types';
import Component from 'vue-class-component';

@Component
export default class BaseView extends Vue {

  /**
   * Trigger a toast notification
   *
   * @param alert Alert
   */
  public toast(alert: Alert) {
    EventBus.$emit('toast', alert);
  }

  /**
   * Interpret server side validation errors
   *
   * @param error
   */
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

    // If the response data has an error set, capture the validation messages
    if (error.response.data.hasOwnProperty('errors')) {
      // handle validation message set
      Object.keys(error.response.data.errors).forEach((key) => {
        this.$validator.errors.add({
          field: key,
          msg: error.response.data.errors[key].shift(),
        });
      });
    } else if (error.response.data.hasOwnProperty('message')) {
      // If the error response only has a "message", display a toast notification
      this.toast({message: error.response.data.message, level: 'danger'});
    } else {
      console.log(error.response.data);
    }
  }

  /**
   * Remove a model from an array of models
   *
   * @param group group
   * @param model model
   * @return void
   */
  public removeModel(group: Model[], model: Model): void {
    const index = group.findIndex((i: Model) => i.hashid === model.hashid);
    if (index > -1) {
      group.splice(index, 1);
    }
  }

  /**
   * Add or update a model in an array of models
   *
   * @param group group
   * @param model model
   * @return void
   */
  public addOrUpdateModel(group: Model[], model: Model): void {
    const index = group.findIndex((i: Model) => i.hashid === model.hashid);
    if (index > -1) {
      group.splice(index, 1, model);
    } else {
      group.push(model);
    }
  }
}
