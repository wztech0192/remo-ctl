using System;
using System.Windows.Forms;
using System.Drawing;
using System.Diagnostics;
using System.Reflection;
using WebSocketSharp.Server;
using System.Net;
using System.Net.Sockets;

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
            IntPtr ConsoleWindow = Process.GetCurrentProcess().MainWindowHandle;
            //  ShowWindow(h, display);
            var wssv = new WebSocketServer(Port);
            wssv.AddWebSocketService("/", ()=>new Receiver(ConsoleWindow));
            wssv.Start();
            do
            {
                Console.WriteLine("Try the following IP Addres in your browser dashboard!");
                PrintIP();
                Console.WriteLine("Type \"Quit\" to exit the app");
                Console.WriteLine("***************************");
            } while (Console.ReadLine().ToLower() != "quit");
         
            wssv.Stop();
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


