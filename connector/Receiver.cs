using System;
using System.Windows.Forms;
using System.Drawing;
using System.Runtime.InteropServices;
using System.Diagnostics;
using WebSocketSharp.Server;
using WebSocketSharp;
using System.Threading;

namespace LocalConn
{
    public class Receiver : WebSocketBehavior
    {
        [DllImport("user32.dll", CharSet = CharSet.Auto, CallingConvention = CallingConvention.StdCall)]
        public static extern void mouse_event(int dwFlags, int dx, int dy, int cButtons, int dwExtraInfo);

        [DllImport("user32.dll")]
        public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

        DateTime lastTime = DateTime.Now;
        //Mouse actions
        private readonly int MOUSEEVENTF_LEFTDOWN = 0x02;
        private readonly int MOUSEEVENTF_LEFTUP = 0x04;
        private readonly int MOUSEEVENTF_RIGHTDOWN = 0x08;
        private readonly int MOUSEEVENTF_RIGHTUP = 0x10;
        private readonly int MOUSEEVENTF_WHEEL = 0x0800;
        private int display = 1;
        private bool Lock = false;
        private readonly IntPtr ConsoleWindow;

        public Receiver(IntPtr ConsoleWindow)
        {
            this.ConsoleWindow = ConsoleWindow;

        }

        protected override void OnOpen()
        {
            Console.WriteLine("Controller Connected!");
            ShowWindow(ConsoleWindow, display);
        }


        protected override void OnClose(CloseEventArgs  e)
        {
            Console.WriteLine("Controller Closed");
        }

        protected override void OnError(ErrorEventArgs e)
        {
            Console.WriteLine("Controller Closed");
        }

        protected override void OnMessage(MessageEventArgs e)
        {
            Handler(e.Data);
        }

        private void LockPC()
        {
            new Thread(() =>
            {
                while (Lock)
                {
                    try
                    {
                        Cursor.Position = new Point(0, 0);
                        Thread.Sleep(50);
                    }
                    catch { }
                }
            }).Start();
        }

        public void Handler(string data)
        {
            string[] split = data.Split('&');
            if(split.Length > 1) { 
            string type = split[0];
            string action = split[1];
                switch (type)
                {
                    case "cmd":
                        if (action == "EXIT")
                        {
                            Environment.Exit(1);
                        }
                        else if (action == "TOGGLE")
                        {
                            display = display == 1 ? 0 : 1;
                            ShowWindow(ConsoleWindow, display);
                        }
                        else if (action == "LOCK")
                        {
                            if (!Lock)
                            {
                                Lock = true;
                                LockPC();
                            }
                            else
                            {
                                Lock = false;
                            }
                        }
                        else
                        {
                            action = action.Replace("\n", "&");
                            Process process = new Process();
                            ProcessStartInfo startInfo = new ProcessStartInfo();
                            startInfo.UseShellExecute = false;
                            startInfo.RedirectStandardOutput = true;
                            startInfo.FileName = "CMD.exe";
                            startInfo.Arguments = "/C " + action;
                            process.StartInfo = startInfo;
                            process.Start();
                            string output = process.StandardOutput.ReadToEnd();
                            Console.WriteLine(output);
                            Send("b&" + output);
                            process.WaitForExit();
                        }
                        break;
                    case "mm":
                        int deltaX = int.Parse(action);
                        int deltaY = int.Parse(split[2]);
                        int x = (Cursor.Position.X + deltaX);
                        int y = (Cursor.Position.Y + deltaY);
                        Cursor.Position = new Point(x, y);
                        /*    int fps = (int)((DateTime.Now - lastTime).TotalMilliseconds);
                            lastTime = DateTime.Now;
                            Console.WriteLine(fps);*/
                        break;
                    case "mc":
                        int click = (action == "left" ? MOUSEEVENTF_LEFTDOWN : MOUSEEVENTF_RIGHTDOWN);
                        mouse_event(click, Cursor.Position.X, Cursor.Position.Y, 0, 0);
                        break;
                    case "me":
                        int unclick = (action == "left" ? MOUSEEVENTF_LEFTUP : MOUSEEVENTF_RIGHTUP);
                        mouse_event(unclick, Cursor.Position.X, Cursor.Position.Y, 0, 0);
                        break;
                    case "mw":
                        int movement = int.Parse(action);
                        mouse_event(MOUSEEVENTF_WHEEL, 0, 0, movement, 0);
                        break;
                    case "ky":
                        string key = action;
                        SendKeys.SendWait(action);
                        break;
                }
            }
        }

    }
}
