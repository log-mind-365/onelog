import { User } from "lucide-react";
import { useAuthMenu } from "@/features/auth/auth.model";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

export const AuthMenuDropdown = () => {
  const authMenuItems = useAuthMenu();
  return (
    <Tooltip>
      <DropdownMenu>
        <TooltipTrigger>
          <DropdownMenuTrigger>
            <Button variant="ghost">
              <User />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <DropdownMenuContent>
          {authMenuItems.map((item) => (
            <DropdownMenuItem key={item.id} onClick={item.action}>
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipContent side="right">
        <p>로그인</p>
      </TooltipContent>
    </Tooltip>
  );
};
