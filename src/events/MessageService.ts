import { Subject, Observable } from 'rxjs';
import { Message } from '../components/Types/GeneralTypes';

const subject = new Subject<Message>();

export function sendMessage(name: string, signal: boolean, data?: {}) {
    subject.next({
        name: name,
        signal: signal,
        data: data
    });
}

export function clearMessages() {
    subject.next();
}

export function receiveMessage(): Observable<Message> {
    return subject.asObservable();
}