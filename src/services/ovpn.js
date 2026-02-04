export const generateOVPN = ({
  ca_crt,
  route_ip,
  client_crt,
  client_key,
  remote_port,
  protocol,
  remote_address,
  ta_key,
  tls_type,
}) => {
  return `auth SHA256
auth-user-pass
ca [inline]
cert [inline]
client
dev tun
explicit-exit-notify
key [inline]
nobind
persist-key
persist-tun
port ${remote_port}
proto ${protocol}
remote ${remote_address}
remote-cert-tls server
resolv-retry infinite
route ${route_ip} 255.255.255.255
route-nopull
${tls_type === "auth" && "key-direction 1"}

<ca>
-----BEGIN CERTIFICATE-----
${ca_crt}
-----END CERTIFICATE-----
</ca>

<cert>
-----BEGIN CERTIFICATE-----
${client_crt}
-----END CERTIFICATE-----
</cert>

<key>
-----BEGIN PRIVATE KEY-----
${client_key}
-----END PRIVATE KEY-----
</key>

<tls-${tls_type}>
-----BEGIN OpenVPN Static key V1-----
${ta_key}
-----END OpenVPN Static key V1-----
</tls-${tls_type}>`;
};

export const parseOVPN = (ovpnContent) => {
  const getTagContent = (tag) => {
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "m");
    const match = ovpnContent.match(regex);
    return match ? match[1].trim() : null;
  };

  const getTlsKey = () => {
    const match = ovpnContent.match(
      /-----BEGIN OpenVPN Static key V1-----\s*([\s\S]*?)\s*-----END OpenVPN Static key V1-----/,
    );
    return match ? match[1].trim() : ovpnContent.trim();
  };

  const getPort = () => {
    const regex = /port\s+(\d+)/;
    const match = ovpnContent.match(regex);
    return match ? match[1].trim() : null;
  };

  const getProtocol = () => {
    const regex = /proto\s+(\w+)/;
    const match = ovpnContent.match(regex);
    return match ? match[1].trim() : null;
  };

  const getRemoteAddress = () => {
    const regex = /remote\s+([\w.-]+)/;
    const match = ovpnContent.match(regex);
    return match ? match[1].trim() : null;
  };

  const getRouteIP = () => {
    const regex = /route\s+([\d.]+)\s+255\.255\.255\.255/;
    const match = ovpnContent.match(regex);
    return match ? match[1].trim() : null;
  };

  const tlsType = ovpnContent.includes("<tls-crypt>") ? "crypt" : "auth";

  return {
    ca_crt: getTagContent("ca"),
    client_crt: getTagContent("cert"),
    client_key: getTagContent("key"),
    tls_type: tlsType,
    ta_key: getTlsKey(),
    remote_port: getPort(),
    protocol: getProtocol(),
    remote_address: getRemoteAddress(),
    route_ip: getRouteIP(),
  };
};

export const createOVPNFile = (ovpnContent, fileName) => {
  const file = new File([ovpnContent], fileName, {
    type: "application/x-openvpn-profile",
  });
  return file;
};
