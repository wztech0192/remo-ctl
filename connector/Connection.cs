using System;
using System.Diagnostics;
using System.Reflection;
using WebSocketSharp.Server;
using System.Net;
using System.Net.Sockets;
using WebSocketSharp;
using QRCoder;

namespace LocalConn
{
    class Connection
    {
        private readonly int Port = 1998;

        public Connection()
        {
            AppDomain.CurrentDomain.AssemblyResolve += (sender, args) =>
            {
                string resourceName = new AssemblyName(args.Name).Name + ".dll";
                string resource = Array.Find(GetType().Assembly.GetManifestResourceNames(), element => element.EndsWith(resourceName));

                using (var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resource))
                {
                    byte[] assemblyData = new byte[stream.Length];
                    stream.Read(assemblyData, 0, assemblyData.Length);
                    return Assembly.Load(assemblyData);
                }
            };
            Init();
        }

        private string QrCode { get; set; } = null;

        private void Init()
        {
            bool isLocal = true;
            IntPtr ConsoleWindow = Process.GetCurrentProcess().MainWindowHandle;
            string cmd = "";
            //  ShowWindow(h, display);
            Receiver receiver = new Receiver(ConsoleWindow);
            WebSocketServer local = SetLocalServer(ConsoleWindow);
            WebSocket remote = SetRemoteClient(ConsoleWindow);
            
            do
            {
                if(cmd == "local" && !isLocal) {
                    isLocal = true;
                    remote.Close();
                    local.AddWebSocketService("/", () => new Receiver(ConsoleWindow));
                    local.Start();
                }
                else if(cmd == "remote" && isLocal)
                {
                    isLocal = false;
                    local.Stop();
                    remote.Connect();
                    remote.Send("hs");
                }

                if (isLocal)
                {
                    Console.WriteLine("Try the following IP Addres in your browser dashboard!");
                    PrintIP();
                    Console.WriteLine("Type \"Remote\" to connect to the remote server");
                }
                else
                {
                    Console.WriteLine("Remote Server Mode");
                    Console.WriteLine("Type \"Local\" to switch back to local");
                }
                Console.WriteLine("Type \"Quit\" to exit the app");
                Console.WriteLine("***************************");
            } while (( cmd = Console.ReadLine().ToLower() )!= "quit");

            if (local != null)
            {
                local.Stop();
            }
        }

        private WebSocketServer SetLocalServer(IntPtr ConsoleWindow)
        {
            var wssv = new WebSocketServer(Port);
            wssv.AddWebSocketService("/", () => new Receiver(ConsoleWindow));
            wssv.Start();
            return wssv;
        }

        private WebSocket SetRemoteClient(IntPtr ConsoleWindow)
        {
            string server = "ws://142.11.215.231:1998";
            var ws = new WebSocket(server);
            var receiver = new Receiver(ConsoleWindow);
            ws.OnMessage += (sender, e) => receiver.Handler(e.Data);
            return ws;
        }

        private void PrintIP()
        {
            Console.WriteLine("***************************");

            var targetIp = "";
            string hostName = Dns.GetHostName(); // Retrive the Name of HOST  
            // Get the IP  
            var host = Dns.GetHostEntry(hostName);
            foreach (IPAddress ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    targetIp = ip + ":" + Port;
                    Console.WriteLine(targetIp);
                }
            }
            Console.WriteLine("***************************");
            Console.WriteLine($"--- QR Code for {targetIp} ---");

            Console.WriteLine("\n" + GetQrCode(targetIp));

            Console.WriteLine("***************************");
        }

        private string GetQrCode(string targetIp)
        {
            if (!string.IsNullOrEmpty(QrCode))
            {
                return QrCode;
            }

            var qrGen = new QRCodeGenerator();
            var qrCodeData = qrGen.CreateQrCode($"https://remo.wztechs.com/?ip={targetIp}", QRCodeGenerator.ECCLevel.Q);
            var qrCode = new AsciiQRCode(qrCodeData);
            var lines = qrCode.GetLineByLineGraphic(1, "1", "0", false);

            // shrink qr code
            // ▀
            // ▄
            // █
            QrCode += "\t";
            for (var i = 0; i < lines.Length; i += 2)
            {
                for(var j = 0; j < lines[i].Length; j++)
                {
                    var isThisLineEmpty = lines[i][j] == '0';
                    var isNextLineEmpty = i == lines.Length - 1 || lines[i + 1][j] == '0';

                    if (isThisLineEmpty)
                    {
                        if (isNextLineEmpty)
                        {
                            QrCode += " ";
                        }
                        else
                        {
                            QrCode += "▄";
                        }
                    }
                    else
                    {
                        if (isNextLineEmpty)
                        {
                            QrCode += "▀";
                        }
                        else
                        {
                            QrCode += "█";
                        }
                    }
                }
                QrCode += Environment.NewLine + "\t";
            }

            return QrCode;

        }
    }
}


