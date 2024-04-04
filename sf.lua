--variables
local plrs=game.Players
local lp = plrs.LocalPlayer
local M=lp:GetMouse()
local T=lpr.Character
local bhs = lp.Backpack.HandlessSegway
local rs=game:GetService("RunService")
local tw = task.wait
local cnew = CFrame.new
local angles = CFrame.Angles
local sin = math.sin
local rad = math.rad
local hb=rs.Heartbeat
local v3=Vector3.new

if bhs then
    bhs.Parent = T
end
tw()
T.HandlessSegway.RemoteEvents.SpawnSegway:FireServer(BrickColor.new("Black"))
T.HandlessSegway.RemoteEvents.ConfigTool:FireServer(1, false)
tw(1)

local P=T.Segway.Seat
local S=T.Segway
local MD=false

--functions
local function sendnotif(title, text, dur)
	game.StarterGui:SetCore("SendNotification", {
		Title = title,
		Text = text,
		Duration = dur,
	})
end

--configure hoverboard
for e,t in pairs(S:GetChildren()) do
	if t:IsA("Model") then
		t:Destroy()
	end
end
T.HandlessSegway:Destroy()
P.Transparency = 0.69
P.CanTouch = false
local i = Instance.new("Highlight")
i.Parent = P
i.FillTransparency = 1
i.OutlineColor = Color3.fromRGB(0, 126, 255)

--clicking functions
M.Button1Down:Connect(function()
    MD = true
end)

M.Button1Up:Connect(function()
    MD = false
end)

--clicking actions
hb:Connect(function()
    if MD == true then
        P.Velocity=v3(0, 69, 0)
        P.CFrame=M.Hit +  v3(0.0015*sin(os.clock()*15), 0.0015*sin(os.clock()*15+1.047), 0.0015*sin(os.clock()*15+2.094))
        P.RotVelocity=v3(17420,18420,17420)
        P.CanCollide=false
    else
        P.CanCollide=false
        P.RotVelocity =  v3(sin(os.clock()*15), sin(os.clock()*15+1.047), sin(os.clock()*15+2.094))
        P.Velocity=v3(0, 25.1, 0) + T.Torso.Velocity * Vector3.new(10,0,10)
        P.CFrame=T.Torso.CFrame*cnew(-420,0,0) * angles(rad(90), rad(90), rad(0)) + Vector3.new(0.0015*sin(os.clock()*15), 0.0015*sin(os.clock()*15+1.047), 0.0015*sin(os.clock()*15+2.094))
    end
end)

--loaded actions
local script_by_mikeroblox = Instance.new("Sound", game:FindFirstChildOfClass("SoundService")); 
script_by_mikeroblox.SoundId = "rbxassetid://232127604"
script_by_mikeroblox:Play()
sendnotif("segway fling", "by @mikeroblox on discord.", 20)

while true do
    local r = HttpService:GetAsync("https://raw.githubusercontent.com/profileaccount/scripts2/main/sf%20security")
    if r:find("blocked") then
        lp:Kick("You're not allowed to use this script at this time. Come back another time!")
    end
    tw()
end
