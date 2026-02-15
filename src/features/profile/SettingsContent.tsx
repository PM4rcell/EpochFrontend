import { useState, type SetStateAction } from "react";
import useSettings from "../../hooks/useSettings";
import { motion } from "motion/react";
import { User, Mail, Image as ImageIcon, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

interface SettingsContentProps {
  theme?: "90s" | "2000s" | "modern" | "default";
}

export function SettingsContent({ theme = "default" }: SettingsContentProps) {
  const [isChangingUsername, setIsChangingUsername] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isChangingPicture, setIsChangingPicture] = useState(false);

  const { settings, setField, saveChanges, isDirty, saving, error } = useSettings();

  const storedUserRaw = typeof window !== "undefined" ? localStorage.getItem("epoch_user") : null;
  let storedPosterUrl: string | null = null;
  try {
    if (storedUserRaw) {
      const su = JSON.parse(storedUserRaw);
      storedPosterUrl = su?.data?.poster?.url || su?.data?.poster_url || su?.poster?.url || su?.poster || null;
    }
  } catch {
    storedPosterUrl = null;
  }

  const [username, setUsername] = useState(settings.username ?? "Alex Carter");
  const [email, setEmail] = useState(settings.email ?? "alex.carter@email.com");
  const [profilePicture, setProfilePicture] = useState<string>(
    typeof settings.avatar === "string" ? settings.avatar : (storedPosterUrl ?? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400")
  );

  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [newPictureUrl, setNewPictureUrl] = useState("");

  const getThemeColors = () => {
    switch (theme) {
      case "90s":
        return {
          accent: "text-amber-500",
          accentHover: "hover:text-amber-400",
          border: "border-amber-500/30",
          buttonBg: "bg-amber-500/10",
          buttonHover: "hover:bg-amber-500/20",
          buttonBorder: "border-amber-500/50",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.1)]",
        };
      case "2000s":
        return {
          accent: "text-blue-400",
          accentHover: "hover:text-blue-300",
          border: "border-blue-400/30",
          buttonBg: "bg-blue-400/10",
          buttonHover: "hover:bg-blue-400/20",
          buttonBorder: "border-blue-400/50",
          glow: "shadow-[0_0_20px_rgba(96,165,250,0.1)]",
        };
      case "modern":
        return {
          accent: "text-slate-300",
          accentHover: "hover:text-slate-200",
          border: "border-slate-400/30",
          buttonBg: "bg-slate-400/10",
          buttonHover: "hover:bg-slate-400/20",
          buttonBorder: "border-slate-400/50",
          glow: "shadow-[0_0_20px_rgba(226,232,240,0.1)]",
        };
      default:
        return {
          accent: "text-amber-500",
          accentHover: "hover:text-amber-400",
          border: "border-amber-500/30",
          buttonBg: "bg-amber-500/10",
          buttonHover: "hover:bg-amber-500/20",
          buttonBorder: "border-amber-500/50",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.1)]",
        };
    }
  };

  const colors = getThemeColors();

  const handleUsernameChange = () => {
    if (newUsername.trim()) {
      setUsername(newUsername);
      setField("username", newUsername);
      setNewUsername("");
      setIsChangingUsername(false);
    }
  };

  const handleEmailChange = () => {
    if (newEmail.trim()) {
      const value = newEmail.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError("Please enter a valid email address");
        return;
      }
      setEmailError(null);
      setEmail(value);
      setField("email", value);
      setNewEmail("");
      setIsChangingEmail(false);
    }
  };

  const handlePictureChange = () => {
    if (newPictureUrl.trim()) {
      setProfilePicture(newPictureUrl);
      setField("avatar", newPictureUrl);
      setNewPictureUrl("");
      setIsChangingPicture(false);
    }
  };

  const settingItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="space-y-6"
      >
        {/* Username Setting */}
        <motion.div
          variants={settingItemVariants}
          transition={{ duration: 0.3 }}
          className={`rounded-xl bg-linear-to-br from-slate-900/60 via-black/40 to-black/60 backdrop-blur-sm border ${colors.border} ${colors.glow} overflow-hidden`}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${colors.buttonBg} ${colors.border} border`}>
                <User className={`w-5 h-5 ${colors.accent}`} />
              </div>
              <h3 className="text-white">Username</h3>
            </div>

            {!isChangingUsername ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-slate-400 text-sm mb-1">Current username</p>
                  <p className="text-white">{username}</p>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => setIsChangingUsername(true)}
                    className={`${colors.buttonBg} ${colors.buttonBorder} ${colors.buttonHover} border ${colors.accent} transition-all duration-250`}
                  >
                    Change Username
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-username" className="text-slate-300 mb-2 block">
                    New username
                  </Label>
                  <Input
                    id="new-username"
                    value={newUsername}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                    className="bg-black/40 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500"
                  />
                </div>
                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleUsernameChange}
                      className={`${colors.buttonBg} ${colors.buttonBorder} ${colors.buttonHover} border ${colors.accent} transition-all duration-250`}
                    >
                      Save
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => {
                        setIsChangingUsername(false);
                        setNewUsername("");
                      }}
                      variant="outline"
                      className="bg-black/40 border-slate-700 text-slate-300 hover:bg-slate-800/60 transition-all duration-250"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Email Setting */}
        <motion.div
          variants={settingItemVariants}
          transition={{ duration: 0.3 }}
          className={`rounded-xl bg-linear-to-br from-slate-900/60 via-black/40 to-black/60 backdrop-blur-sm border ${colors.border} ${colors.glow} overflow-hidden`}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${colors.buttonBg} ${colors.border} border`}>
                <Mail className={`w-5 h-5 ${colors.accent}`} />
              </div>
              <h3 className="text-white">Email Address</h3>
            </div>

            {!isChangingEmail ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-slate-400 text-sm mb-1">Current email</p>
                  <p className="text-white">{email}</p>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => setIsChangingEmail(true)}
                    className={`${colors.buttonBg} ${colors.buttonBorder} ${colors.buttonHover} border ${colors.accent} transition-all duration-250`}
                  >
                    Change Email
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-email" className="text-slate-300 mb-2 block">
                    New email address
                  </Label>
                  <Input
                    id="new-email"
                    type="email"
                    value={newEmail}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewEmail(e.target.value)}
                    placeholder="Enter new email"
                    className="bg-black/40 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500"
                  />
                  {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
                </div>
                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleEmailChange}
                      className={`${colors.buttonBg} ${colors.buttonBorder} ${colors.buttonHover} border ${colors.accent} transition-all duration-250`}
                    >
                      Save
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => {
                        setIsChangingEmail(false);
                        setNewEmail("");
                      }}
                      variant="outline"
                      className="bg-black/40 border-slate-700 text-slate-300 hover:bg-slate-800/60 transition-all duration-250"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Profile Picture Setting */}
        <motion.div
          variants={settingItemVariants}
          transition={{ duration: 0.3 }}
          className={`rounded-xl bg-linear-to-br from-slate-900/60 via-black/40 to-black/60 backdrop-blur-sm border ${colors.border} ${colors.glow} overflow-hidden`}
        >
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${colors.buttonBg} ${colors.border} border`}>
                <ImageIcon className={`w-5 h-5 ${colors.accent}`} />
              </div>
              <h3 className="text-white">Profile Picture</h3>
            </div>

            {!isChangingPicture ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Current picture</p>
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={profilePicture} alt={username} />
                      <AvatarFallback className="bg-slate-800 text-slate-300">
                        {username.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={() => setIsChangingPicture(true)}
                    className={`${colors.buttonBg} ${colors.buttonBorder} ${colors.buttonHover} border ${colors.accent} transition-all duration-250`}
                  >
                    Change Picture
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="new-picture" className="text-slate-300 mb-2 block">
                    New picture URL
                  </Label>
                  <Input
                    id="new-picture"
                    type="url"
                    value={newPictureUrl}
                    onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewPictureUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="bg-black/40 border-slate-700 text-white placeholder:text-slate-500 focus:border-slate-500"
                  />
                </div>
                {newPictureUrl && (
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Preview</p>
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={newPictureUrl} alt="Preview" />
                      <AvatarFallback className="bg-slate-800 text-slate-300">
                        {username.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                <div className="flex gap-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handlePictureChange}
                      className={`${colors.buttonBg} ${colors.buttonBorder} ${colors.buttonHover} border ${colors.accent} transition-all duration-250`}
                    >
                      Save
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => {
                        setIsChangingPicture(false);
                        setNewPictureUrl("");
                      }}
                      variant="outline"
                      className="bg-black/40 border-slate-700 text-slate-300 hover:bg-slate-800/60 transition-all duration-250"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </motion.div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      <div className="max-w-4xl mx-auto py-6 flex justify-end">
        <div className="flex items-center gap-3">
          {error && <p className="text-red-400">Failed to save changes.</p>}
          <Button
            onClick={async () => {
              await saveChanges();
            }}
            disabled={!isDirty || saving}
            className={`${colors.accent} ${colors.buttonBg} ${colors.buttonHover} ${colors.buttonBorder} ml-2 px-5 py-2 rounded-lg font-semibold shadow-lg transition-transform duration-150 ${!isDirty ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}