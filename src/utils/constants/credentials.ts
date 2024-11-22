import type { Auth } from 'googleapis';
import { google } from 'googleapis';

// interfaces
interface IGSheet {
  id: string;
  range: string;
  getClient: () => Promise<Auth.JWT>;
}

// constants
const private_key =
  process.env.NEXT_PUBLIC_GHEET_PK ??
  '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCkrVDXNjFoMmQ2\neBi0WNi7CrRRxv29jFxDPJuKaONIIu1Nh7e8//RiCfa0YVOKQd1WYF2WF1LDsXI2\nK8PJwcMxXAIE3eqgSfKtSAqsnvALwFJAUW2RRqdwu9c3ANqrOw5mqrPwXkuo25T6\nWCwWadTSPeMb/NYO4GI3H/v2GlWyDNsB2fUCFwhVQtk+aMRmqPaCTngJTHNBX3KM\njU5ZOsF+HbuTYfsFbcSlVy4jBtGKjhhC4IDTj3+AYTA+v/YK1WwuDuz93H7W9K3O\nCShTfzKVm1OtJHofNE5H0wYq6j7Q2vdZ3GWdu+izT8V++BQD2X/1nCqVtiJJJhXf\n8N2nLTLHAgMBAAECggEAAyn+IgrW62GZSB9wM61HvMN5fRJahCHTEMra6897TnXq\nIus3CvKZoQ7/80dLcgSbjbIcTWrCGr1C37eUWdpw0N0rsykJ/dQHgNZst632GF1O\naneMdPyE8XpdqdJ7+rF2MJLNeKwKWBw5jvXSvKHoubSZ5uSP8e+g83fLdFcQZNnC\nc8UlTnPWX7jMFeKdk/y7C5d3kRT++LwMDFzGz0G+Yan8Dah9QkbtuxJtWb67GU5G\neVny8PzmHDHVjFGklahvmXxkDoGEaKx8svqAb5MAOeXw6wzJ+l0eBY9zol1L1by4\nY/gXEXPwpqYJ0Jw/ZIC5s48TmZpKbC9BLZ1MXFz0AQKBgQDjFABn01sTd+DqCVm7\n2h3YAzTABbDIkoKBCXrxcH3l2o3DFq2tX55nDE/hl5GPvsgbA7w2+a06A8szZTV6\nkVRFWz22qkoBaaTl2TfZUn5o03Ws9B07FRYY/NYsJXep6HeRZSZDNAE8dvH7zaGJ\nA67+HD/CQcIzNsMfn287Gq/eQQKBgQC5prGl0sViab/RjH/apHhzAVrI0TysHsxb\neNH2Rk69q56/TzdzeBG46/G+hb+9EmgGwX7SMwtw2keQlGtlf1CXTpcpDSc0HhXD\ngs4DHZSCLONe9VjYvykwhRO0PoI8dsAo/L7zQhVTO1TpMeUEgUfSn/PWIvAwHRr1\nll3G9+RfBwKBgQCklP6mQd4lAiIV/qj3KmOvCMPW2UkEVowYElL1Y18clYdh+rHu\nkvswHRBYpY5u7QwD6HUmM1iGT/GbUqOsLmEx06urFUmGNJe7r/B2pv/P4lPMAzKc\ne/AENFzWqmFM2Jyw2OsekjbDKELDCoslz3Gp47eiiB7FF8/cv6XS5MjLAQKBgQCR\nZny74te0vB3/gIqiMy4i5Gy12yopo/VprrbCq04APumV6/UB+ofmzOQI07fX3RKc\nN++bsV7EhDCIi7WRSKVV27eH70VFDEr/VPMEfaZSTdXGCWIMX6ti1NcZ09ssf9UA\nRPNIkfkhttZJzUoQvTADRkMy8yoqhKEYtyu7KWszAQKBgDawAMVk02l5dzKRBrr0\n2ffUwSSeZnxUR89e5miXu8PWwTkth1l15Ag94GdoEMZCYIPIq+H6n0i9ewpbjxBX\n6esi6rJUyWozJHo27E1XV6j/48scng2PoQvwiigYhS5hSxa92CPradVg4hCtzNi3\nsaD5ipTp63s+sY/q0dHfHLOP\n-----END PRIVATE KEY-----\n';

const client_email =
  process.env.NEXT_PUBLIC_GHSHEET_SERVICER ??
  'upshift@upshift-438705.iam.gserviceaccount.com';

// globally exported obj
const GSHEET: IGSheet = {
  id:
    process.env.NEXT_PUBLIC_CONTACT_SPREADSHEET_ID ??
    '1ZqtV0g42dvENmSQbO-E4VcKKrFe6-bPRAvnsHgEoH-0',
  range: process.env.NEXT_PUBLIC_CONTACT_SPREADSHEET_RANGE ?? 'app-logs!A:G', // Adjust range as needed
  getClient: async () => {
    const auth = new google.auth.JWT(client_email, undefined, private_key, [
      'https://www.googleapis.com/auth/spreadsheets',
    ]);
    return auth;
  },
};

export default GSHEET;
