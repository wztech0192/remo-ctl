using System;
using System.Windows.Forms;
using System.Drawing;
using System.Diagnostics;
using System.Reflection;
using WebSocketSharp.Server;
using System.Net;
using System.Net.Sockets;
using WebSocketSharp;

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
            string hostName = Dns.GetHostName(); // Retrive the Name of HOST  
            // Get the IP  
            var host = Dns.GetHostEntry(hostName);
            foreach (IPAddress ip in host.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    Console.WriteLine(ip+":"+Port);
                }
            }
            Console.WriteLine("***************************");
        }
    }
}


