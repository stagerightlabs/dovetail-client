import axios from '@/repositories/axios';
import { AxiosPromise } from 'axios';

export default {
    readSetting(key: string): AxiosPromise<any> {
        return axios.get(`/organization/setting/${key}`);
    },

    writeSetting(key: string, value: string): AxiosPromise<any> {
        return axios.post(`/organization/setting`, {
            '`setting[${key}]`': value,
        });
    },
};