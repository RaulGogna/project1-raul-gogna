export class Http {
    static async ajax<T>(method: string, url: string, headers: HeadersInit = {}, body: any = null): Promise<T> {
        const token = localStorage.getItem('token');
        if(token) headers = {...headers, Authorization: 'Bearer ' + token};

        const resp = await fetch(url, { method, headers, body});
        if(!resp.ok) throw resp;
        if(resp.status != 204) {
            return await resp.json(); // promise
        } else {
            return null;
        }
    }

    static get<T>(url: string): Promise<T> {
        return Http.ajax('GET', url);
    }

    static post<T>(url: string, data: any): Promise<T> {
        return Http.ajax('POST', url, {'Content-Type': 'application/json'}, JSON.stringify(data));
    }

    static put<T>(url: string, data: any): Promise<T> {
        return Http.ajax('PUT', url, {'Content-Type': 'application/json'}, JSON.stringify(data));
    }

    static delete<T>(url: string): Promise<T> {
        return Http.ajax('DELETE', url);
    }
}