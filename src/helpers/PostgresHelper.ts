import * as moment from 'moment';

export const unixTimestampToPostgresFormat = (time: string) => {
    if (!/^-?\d+$/.test(time))
        throw new Error('timestamp parsing failed');
    const timestamp = parseInt(time);
    return moment.unix(timestamp).format('YYYY-MM-DD HH:mm:ss');
};
