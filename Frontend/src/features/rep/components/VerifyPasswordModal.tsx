import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import toast from "react-hot-toast";
import { verifyPassword } from "../api";
// Note: verifyPassword needs to be added to api file or similar. 
// I will check api file next. Assuming verifyPassword exists or I will create it.
// Actually, I should check api file first or add it. 
// For now I'll assume it returns a promise.

interface VerifyPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function VerifyPasswordModal({
    isOpen,
    onClose,
    onSuccess,
}: VerifyPasswordModalProps) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password) {
            toast.error("Please enter your password");
            return;
        }
        setLoading(true);
        try {
            // verifyPassword implementation will be checked/added
            const res = await verifyPassword(password);
            if (res.success) {
                onSuccess();
                setPassword("");
                onClose();
            } else {
                toast.error(res.message || "Incorrect password");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Verify Password</DialogTitle>
                    <DialogDescription>
                        Please enter your current password to continue.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Verifying..." : "Verify"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
