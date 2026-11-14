

var ipChildNode = {
    Enable: x_wan_Enable,
    Name: x_wan_Name,
    ConnectionType: x_wan_ConnectionType,
    ServiceList: x_wan_ServiceList,
    IPMode: x_wan_IPMode,
    MTU: x_wan_MaxMTUSize,
    LanInterface: x_wan_LanInterface,
    AddressingType: x_wan_AddressingType,
    ExternalIPAddress: x_wan_ExternalIPAddress,
    DNSServers: x_wan_DNSServers,
    IPv6PrefixDelegationEnabled: x_wan_IPv6PrefixDelegationEnabled,
    IPv6PrefixOrigin: x_wan_IPv6PrefixOrigin,
    IPv6Prefix: x_wan_IPv6Prefix,
    IPv6IPAddressOrigin: x_wan_IPv6IPAddressOrigin,
    IPv6IPAddress: x_wan_IPv6IPAddress,
    DefaultIPv6Gateway: x_wan_DefaultIPv6Gateway,
    IPv6DNSServers: x_wan_IPv6DNSServers,
    Dslite_Enable: x_wan_Dslite_Enable,
    AftrMode: x_wan_AftrMode,
    Aftr: x_wan_Aftr,
    ConnectionStatus: x_wan_ConnectionStatus,
    IPv6ConnStatus: x_wan_IPv6ConnStatus,
    NPTv6Enable: x_wan_NPTv6Enable,
    MACAddress: x_wan_MACAddress,
    NATEnabled: x_wan_NATEnabled,
    IPForwardList: x_wan_IPForwardList,
    SubnetMask: x_wan_SubnetMask,
    DefaultGateway: x_wan_DefaultGateway,
    p8021: x_wan_8021pMark,
    VLANID: x_wan_link_VLANID,
    VLANMode: x_wan_link_Mode,
    Uptime: x_wan_Uptime,
    CurrentOnlineTime : x_FH_ConnectionTotalTime,
    DDNSConfiguration: {
        url: x_wan_DDNSConfiguration,
        node: {
            DDNSCfgEnabled: x_DDNS_Enabled,
            DDNSProvider: x_DDNS_Provider,
            DDNSDomainName: x_DDNS_DomainName,
            DDNSUsername: x_DDNS_UserName,
            DDNSPassword: x_DDNS_Password,
            DDNSName: x_DDNS_DDNSName,
        }
    }
}

var pppChildNode = {
    Enable: x_wan_Enable,
    Name: x_wan_Name,
    ConnectionType: x_wan_ConnectionType,
    ServiceList: x_wan_ServiceList,
    IPMode: x_wan_IPMode,
    MTU: x_wan_MaxMRUSize,
    LanInterface: x_wan_LanInterface,
    AddressingType: x_wan_AddressingType,
    ExternalIPAddress: x_wan_ExternalIPAddress,
    DNSServers: x_wan_DNSServers,
    IPv6PrefixDelegationEnabled: x_wan_IPv6PrefixDelegationEnabled,
    IPv6PrefixOrigin: x_wan_IPv6PrefixOrigin,
    IPv6Prefix: x_wan_IPv6Prefix,
    IPv6IPAddressOrigin: x_wan_IPv6IPAddressOrigin,
    IPv6IPAddress: x_wan_IPv6IPAddress,
    DefaultIPv6Gateway: x_wan_DefaultIPv6Gateway,
    IPv6DNSServers: x_wan_IPv6DNSServers,
    Dslite_Enable: x_wan_Dslite_Enable,
    AftrMode: x_wan_AftrMode,
    Aftr: x_wan_Aftr,
    ConnectionStatus: x_wan_ConnectionStatus,
    IPv6ConnStatus: x_wan_IPv6ConnStatus,
    NPTv6Enable: x_wan_NPTv6Enable,
    MACAddress: x_wan_MACAddress,
    NATEnabled: x_wan_NATEnabled,
    IPForwardList: x_wan_IPForwardList,
    RemoteIPAddress: x_wan_RemoteIPAddress,
    Username: x_wan_Username,
    Password: x_wan_Password,
    ConnectionTrigger: x_wan_ConnectionTrigger,
    IdleDisconnectTime: x_wan_IdleDisconnectTime,
    ProxyEnable: x_wan_ProxyEnable,
    MAXUser: x_wan_MAXUser,
    PPPoEPassthrough: x_wan_PPPoEPassthrough,
    TransportType: x_wan_TransportType,
    LastConnectionError: x_wan_LastConnectionError,
    p8021: x_wan_8021pMark,
    VLANID: x_wan_link_VLANID,
    VLANMode: x_wan_link_Mode,
    Uptime: x_wan_Uptime,
    SubnetMask: x_wan_SubnetMask,
    DefaultGateway: x_wan_RemoteIPAddress,
    CurrentOnlineTime : x_FH_ConnectionTotalTime,
    DDNSConfiguration: {
        url: x_wan_DDNSConfiguration,
        node: {
            DDNSCfgEnabled: x_DDNS_Enabled,
            DDNSProvider: x_DDNS_Provider,
            DDNSDomainName: x_DDNS_DomainName,
            DDNSUsername: x_DDNS_UserName,
            DDNSPassword: x_DDNS_Password,
            DDNSName: x_DDNS_DDNSName,
        }
    }
}



var multiIpChildNode = {
    Enable: x_wan_Enable,
    Name: x_wan_Name,
    ConnectionType: x_wan_ConnectionType,
    ServiceList: x_wan_ServiceList,
    IPMode: x_wan_IPMode,
    MTU: x_wan_MaxMTUSize,
    LanInterface: x_wan_LanInterface,
    AddressingType: x_wan_AddressingType,
    ExternalIPAddress: x_wan_ExternalIPAddress,
    DNSServers: x_wan_DNSServers,
    IPv6PrefixDelegationEnabled: x_wan_IPv6PrefixDelegationEnabled,
    IPv6PrefixOrigin: x_wan_IPv6PrefixOrigin,
    IPv6Prefix: x_wan_IPv6Prefix,
    IPv6IPAddressOrigin: x_wan_IPv6IPAddressOrigin,
    IPv6IPAddress: x_wan_IPv6IPAddress,
    DefaultIPv6Gateway: x_wan_DefaultIPv6Gateway,
    IPv6DNSServers: x_wan_IPv6DNSServers,
    Dslite_Enable: x_wan_Dslite_Enable,
    AftrMode: x_wan_AftrMode,
    Aftr: x_wan_Aftr,
    ConnectionStatus: x_wan_ConnectionStatus,
    IPv6ConnStatus: x_wan_IPv6ConnStatus,
    NPTv6Enable: x_wan_NPTv6Enable,
    MACAddress: x_wan_MACAddress,
    NATEnabled: x_wan_NATEnabled,
    IPForwardList: x_wan_IPForwardList,
    SubnetMask: x_wan_SubnetMask,
    DefaultGateway: x_wan_DefaultGateway,
    p8021: x_wan_8021pMark,
    VLANID: x_wan_link_VLANID,
    VLANMode: x_wan_link_Mode,
    Uptime: x_wan_Uptime,
    CurrentOnlineTime : x_FH_ConnectionTotalTime,
}

var multiPPPChildNode = {
    Enable: x_wan_Enable,
    Name: x_wan_Name,
    ConnectionType: x_wan_ConnectionType,
    ServiceList: x_wan_ServiceList,
    IPMode: x_wan_IPMode,
    MTU: x_wan_MaxMRUSize,
    LanInterface: x_wan_LanInterface,
    AddressingType: x_wan_AddressingType,
    ExternalIPAddress: x_wan_ExternalIPAddress,
    DNSServers: x_wan_DNSServers,
    IPv6PrefixDelegationEnabled: x_wan_IPv6PrefixDelegationEnabled,
    IPv6PrefixOrigin: x_wan_IPv6PrefixOrigin,
    IPv6Prefix: x_wan_IPv6Prefix,
    IPv6IPAddressOrigin: x_wan_IPv6IPAddressOrigin,
    IPv6IPAddress: x_wan_IPv6IPAddress,
    DefaultIPv6Gateway: x_wan_DefaultIPv6Gateway,
    IPv6DNSServers: x_wan_IPv6DNSServers,
    Dslite_Enable: x_wan_Dslite_Enable,
    AftrMode: x_wan_AftrMode,
    Aftr: x_wan_Aftr,
    ConnectionStatus: x_wan_ConnectionStatus,
    IPv6ConnStatus: x_wan_IPv6ConnStatus,
    NPTv6Enable: x_wan_NPTv6Enable,
    MACAddress: x_wan_MACAddress,
    NATEnabled: x_wan_NATEnabled,
    IPForwardList: x_wan_IPForwardList,
    RemoteIPAddress: x_wan_RemoteIPAddress,
    Username: x_wan_Username,
    Password: x_wan_Password,
    ConnectionTrigger: x_wan_ConnectionTrigger,
    IdleDisconnectTime: x_wan_IdleDisconnectTime,
    ProxyEnable: x_wan_ProxyEnable,
    MAXUser: x_wan_MAXUser,
    PPPoEPassthrough: x_wan_PPPoEPassthrough,
    TransportType: x_wan_TransportType,
    LastConnectionError: x_wan_LastConnectionError,
    p8021: x_wan_8021pMark,
    VLANID: x_wan_link_VLANID,
    VLANMode: x_wan_link_Mode,
    Uptime: x_wan_Uptime,
    SubnetMask: x_wan_SubnetMask,
    DefaultGateway: x_wan_RemoteIPAddress,
    CurrentOnlineTime : x_FH_ConnectionTotalTime,
}
var allWanDataObj = {
    url: x_WANConnectionDevice_obj,
    node: {
        ipoe:{
            url: x_WANIPConnection,
            node: ipChildNode
        },
        pppoe:{
            url: x_WANPPPConnection,
            node: pppChildNode
        },
    }
}
var allWanNameDataObj = {
    url: x_WANConnectionDevice_obj,
    node: {
        ipoe:{
            url: x_WANIPConnection,
            node: {
                Enable: x_wan_Enable,
                Name: x_wan_Name,
                IPMode: x_wan_IPMode
            }
        },
        pppoe:{
            url: x_WANPPPConnection,
            node: {
                Enable: x_wan_Enable,
                Name: x_wan_Name,
                IPMode: x_wan_IPMode
            }
        }
    }
}

var allVPNDataObj = {
    url: x_VPNConnection_obj,
    node: {
        l2tp:{
            url: x_VPNL2TPConnection,
            node: {
                Name: x_VPN_name,
                Enable: x_VPN_enable,
                Status: x_VPN_status,
                ClientIP: x_VPN_ClientIp,
                Type: x_VPN_type,
                Addr: x_VPN_addr,
                Account: x_VPN_account,
                Password: x_VPN_pwd,
                LocalAddress: x_VPNAdvance_localAddr,
                MPPEMode: x_VPNAdvance_MPPEMode,
                MTU: x_VPNAdvance_MTU,
                DefaultGateway: x_VPNAdvance_DefaultGateway,
                TunnelHost: x_VPNAdvance_TunnelHost,
                TunnelPass: x_VPNAdvance_TunnelPass,
                IPSecEnable: x_VPNAdvance_IPSecEnable,
                IPSecPSK: x_VPNAdvance_IPSecPSK,
            }
        },
        pptp:{
            url: x_VPNPPTPConnection,
            node: {
                Name: x_VPN_name,
                Enable: x_VPN_enable,
                Status: x_VPN_status,
                ClientIP: x_VPN_ClientIp,
                Type: x_VPN_type,
                Addr: x_VPN_addr,
                Account: x_VPN_account,
                Password: x_VPN_pwd,
                LocalAddress: x_VPNAdvance_localAddr,
                MPPEMode: x_VPNAdvance_MPPEMode,
                MTU: x_VPNAdvance_MTU,
                DefaultGateway: x_VPNAdvance_DefaultGateway,
            }
        }
    }
}

var apObj = {
    url: x_APDevice_obj,
    node: {
        Active: x_APDevice_Active,
        ParentMACAddress: x_APDevice_ParentMACAddress,
        MACAddress: x_APDevice_MACAddress,
        BackhaulLinkType: x_APDevice_BackhaulLinkType,
        RSSI: x_APDevice_BackhaulSignalStrength,
        BackhaulPHYRate: x_APDevice_BackhaulPHYRate,
        Radio: {
            url: x_AP_Radio_obj,
            node: {
                OperatingFrequencyBand: x_AP_Radio_OperatingFrequencyBand
            }
        },
        AP_1: {
            url: x_AP_Radio_obj + "1." + x_Radio_AP_obj,
            node: {
                AssociatedDevice: {
                    url: x_AssociatedDevice_obj,
                    node: {
                        MACAddress: x_AssociatedDevice_MACAddress,
                        Active: x_AssociatedDevice_Active,
                        RSSI: x_AssociatedDevice_SignalStrength,
                        PHYRate: x_AssociatedDevice_PHYRate
                    }
                }
            }
        },
        AP_2: {
            url: x_AP_Radio_obj+ "2." + x_Radio_AP_obj,
            node: {
                AssociatedDevice: {
                    url: x_AssociatedDevice_obj,
                    node: {
                        MACAddress: x_AssociatedDevice_MACAddress,
                        Active: x_AssociatedDevice_Active,
                        RSSI: x_AssociatedDevice_SignalStrength,
                        PHYRate: x_AssociatedDevice_PHYRate
                    }
                }
            }
        },
        AP_3: {
            url: x_AP_Radio_obj+ "3." + x_Radio_AP_obj,
            node: {
                AssociatedDevice: {
                    url: x_AssociatedDevice_obj,
                    node: {
                        MACAddress: x_AssociatedDevice_MACAddress,
                        Active: x_AssociatedDevice_Active,
                        RSSI: x_AssociatedDevice_SignalStrength,
                        PHYRate: x_AssociatedDevice_PHYRate
                    }
                }
            }
        }
    }
}
var hostObj = {
    url: x_Hosts_Host_obj,
    node:{
        HostName: x_Host_HostName,
        DevName: x_Host_DevName,
        MACAddress: x_Host_MacAddress,
        IPAddress: x_Host_IPAddress,
        IPv6Address:  x_Host_IPv6Address,
        DeviceType: x_Host_DeviceType,
        OnlineTime: x_Host_OnlineTime,
        AckTime: x_Host_AckTime,
        Active: x_Host_Active,
        UpSpeed: x_Host_UpSpeed,
        DownSpeed: x_Host_DownSpeed,
        MaxUSBandwidth: x_Host_MaxUSBandwidth,
        MaxDSBandwidth: x_Host_MaxDSBandwidth,
        InternetAccess: x_Host_InternetAccess,
        ConnectionType: x_Host_ConnectionType,
        Layer2Interface: x_Host_Layer2Interface,
        Port: x_Host_Port
    }
};
var multiWanDataObj = {
    url: x_WANDevice_obj,
    num: 2,
    node: {
        wanconnection:{
            url: x_WANConnectionDevice,
            node: {
                ipoe:{
                    url: x_WANIPConnection,
                    node: multiIpChildNode
                },
                pppoe:{
                    url: x_WANPPPConnection,
                    node: multiPPPChildNode
                },
            }
        }
    }
}