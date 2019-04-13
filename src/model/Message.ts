export interface PTZParameters {
    cameraid: string;
    model: string;
    deviceIP: string;
    username: string;
    password: string;
    channelid: number;
    panValue?: number;
    tileValue?: number;
    zoomValue?: number;
}

export enum UTCMessageType {
    mtSTOP = 'stopCommunication',
    mtPROXYREGISTER = 'proxyRegister',
    mtPROXYRESPONSE = 'proxy',
    mtHEARTBEAT = 'heartbeat',
    mtSETUPURL = 'setupURL',
    mtMERSOFTCOMMAND = 'mersoftCommand',
    mtMERSOFTNOTIFICATION = 'mersoftNotification',
    mtRESPONSE = 'response',
    mtPTZ = 'PTZ'
}

export interface Message {
    id: UTCMessageType;
    sessionId?: string;
    gatewayId?: string;
    data?: any;
}

export interface CandidateDesc {
    candidate: any,
    sdpMLineIndex: string,
    sdpMid: string;
}

export interface PayloadInfo {
    callId?: string;
    peerId?: string;
    WSC_ID?: string;
    ICE_Candidate?: any;
    candidate?: any;
    sdp?: any;
}

export interface MoveCommand {
    moveOperation: string;
    moveDeviceId: string;
    gatewayId?: string;
    payload?: PayloadInfo;    
}
