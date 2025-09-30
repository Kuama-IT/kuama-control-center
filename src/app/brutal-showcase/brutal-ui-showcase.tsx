"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { toast } from "sonner";
import {
  Square,
  Circle,
  Triangle,
  ArrowRight,
  Hash,
  Minus,
  Calendar as CalendarIcon,
  Search,
  User,
  Settings,
  Database,
  MoreHorizontal,
  Plus,
  Download,
  Edit,
  Trash,
  Bell,
} from "lucide-react";

export default function BrutalUIShowcase() {
  const [selectedTab, setSelectedTab] = useState("FORMS");
  const [progress, setProgress] = useState(73);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [open, setOpen] = useState(false);

  const brutalClasses = {
    background: "bg-white min-h-screen",
    card: "bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-6",
    cardSecondary:
      "bg-gray-100 border-4 border-black shadow-[6px_6px_0px_0px_#333333] p-4",
    button: {
      primary:
        "bg-black text-white border-6 border-black hover:bg-white hover:text-black transition-all duration-200 font-black uppercase tracking-wider text-lg px-8 py-6 shadow-[12px_8px_0px_0px_#666666,6px_4px_0px_0px_#999999] hover:shadow-[6px_4px_0px_0px_#666666,3px_2px_0px_0px_#999999] hover:translate-x-[6px] hover:translate-y-[4px] rounded-none cursor-pointer",
      secondary:
        "bg-white text-black border-6 border-black hover:bg-white hover:text-black hover:border-white transition-all duration-200 font-black uppercase tracking-wider text-lg px-8 py-6 shadow-[8px_12px_0px_0px_#666666,4px_6px_0px_0px_#999999] hover:shadow-[4px_6px_0px_0px_#666666,2px_3px_0px_0px_#999999] hover:translate-x-[4px] hover:translate-y-[6px] rounded-none cursor-pointer",
      danger:
        "bg-red-500 text-white border-6 border-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 font-black uppercase tracking-wider text-lg px-8 py-6 shadow-[10px_10px_0px_0px_#333333,5px_5px_0px_0px_#666666] hover:shadow-[5px_5px_0px_0px_#333333,2px_2px_0px_0px_#666666] hover:translate-x-[5px] hover:translate-y-[5px] rounded-none cursor-pointer",
    },
    input:
      "bg-white border-6 border-black text-black text-xl font-bold px-6 py-6 focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-200 shadow-[8px_8px_0px_0px_#333333] focus:shadow-[12px_12px_0px_0px_#333333] focus:translate-x-[-2px] focus:translate-y-[-2px] rounded-none",
    checkbox:
      "h-8 w-8 border-4 border-black data-[state=checked]:bg-black data-[state=checked]:text-white rounded-none shadow-[4px_4px_0px_0px_#333333] focus:shadow-[6px_6px_0px_0px_#333333] cursor-pointer",
    calendar: {
      container:
        "border-4 border-black shadow-[8px_8px_0px_0px_#333333] bg-white p-4 rounded-none",
      months: "space-y-4",
      month: "space-y-4",
      caption: "flex justify-center pt-1 relative items-center",
      caption_label: "font-black text-lg uppercase tracking-wider",
      nav: "space-x-1 flex items-center",
      nav_button:
        "h-10 w-10 bg-white hover:bg-black hover:text-white border-2 border-black font-bold transition-all duration-150 rounded-none cursor-pointer flex items-center justify-center",
      nav_button_previous: "absolute left-1",
      nav_button_next: "absolute right-1",
      table: "w-full border-collapse",
      head_row: "",
      head_cell: "text-black font-black uppercase text-sm text-center p-2",
      row: "",
      cell: "text-center p-0 relative",
      day: "h-12 w-12 border-2 border-black font-bold hover:bg-black hover:text-white transition-all duration-150 rounded-none cursor-pointer text-center leading-12",
      day_selected: "bg-black text-white border-black",
      day_today: "bg-red-500 text-white border-red-500",
      day_outside: "text-gray-400 opacity-50",
      day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
      day_range_middle: "aria-selected:bg-gray-100 aria-selected:text-black",
      day_hidden: "invisible",
    },
    avatar: {
      container:
        "h-16 w-16 border-4 border-black shadow-[4px_4px_0px_0px_#333333] rounded-none bg-gray-100",
      fallback: "bg-black text-white font-black text-xl",
    },
    table: {
      container:
        "border-4 border-black shadow-[8px_8px_0px_0px_#333333] bg-white",
      header: "border-b-4 border-black bg-gray-100",
      headerCell:
        "border-r-2 border-black p-6 font-black uppercase text-lg last:border-r-0",
      row: "border-b-2 border-black hover:bg-gray-50 transition-colors duration-150",
      cell: "border-r-2 border-black p-6 font-bold last:border-r-0",
    },
    dialog: {
      overlay: "bg-black bg-opacity-50",
      content:
        "border-6 border-black shadow-[12px_12px_0px_0px_#333333] bg-white p-8 rounded-none",
      title: "font-black text-3xl uppercase tracking-wider mb-4",
      description: "font-bold text-lg text-gray-700 mb-6",
    },
    hoverCard: {
      content:
        "border-4 border-black shadow-[6px_6px_0px_0px_#333333] bg-white p-4 rounded-none",
      trigger:
        "border-b-2 border-black font-bold cursor-pointer hover:bg-black hover:text-white transition-all duration-150 px-2 py-1",
    },
    command: {
      container:
        "border-4 border-black shadow-[8px_8px_0px_0px_#333333] bg-white rounded-none",
      input:
        "border-0 border-b-4 border-black px-6 py-4 font-bold text-lg focus:outline-none rounded-none bg-white",
      item: "px-6 py-4 font-bold hover:bg-black hover:text-white cursor-pointer transition-all duration-150 border-b-2 border-gray-200 last:border-b-0",
      group: "border-b-4 border-black last:border-b-0",
      groupHeading:
        "px-6 py-3 bg-gray-100 font-black uppercase text-sm tracking-wider border-b-2 border-black",
    },
    popover: {
      content:
        "border-4 border-black shadow-[8px_8px_0px_0px_#333333] bg-white p-6 rounded-none",
      trigger:
        "border-4 border-black font-bold hover:bg-black hover:text-white transition-all duration-150 px-4 py-2 cursor-pointer rounded-none",
    },
    skeleton: {
      default: "bg-gray-300 border-2 border-black rounded-none",
      avatar: "bg-gray-300 border-4 border-black rounded-none",
      text: "bg-gray-300 border-2 border-black rounded-none",
    },
    form: {
      container: "space-y-8",
      field: "space-y-3",
      label: "font-black uppercase text-lg tracking-wider",
      description: "font-bold text-sm text-gray-600 uppercase",
      message: "font-bold text-sm text-red-500 uppercase tracking-wider",
    },
    dropdown: {
      trigger:
        "border-4 border-black font-bold hover:bg-black hover:text-white transition-all duration-150 px-4 py-2 cursor-pointer rounded-none",
      content:
        "border-4 border-black shadow-[8px_8px_0px_0px_#333333] bg-white p-2 rounded-none",
      item: "px-4 py-3 font-bold hover:bg-black hover:text-white cursor-pointer transition-all duration-150 uppercase",
      separator: "border-t-2 border-black my-2",
      label:
        "px-4 py-2 font-black uppercase text-sm tracking-wider bg-gray-100",
    },
    dateRangePicker: {
      container:
        "border-4 border-black shadow-[6px_6px_0px_0px_#333333] bg-white rounded-none",
      trigger:
        "border-4 border-black font-bold hover:bg-black hover:text-white transition-all duration-150 px-4 py-3 cursor-pointer rounded-none w-full justify-start text-left",
    },
    text: {
      primary: "text-black font-bold",
      secondary: "text-gray-700 font-medium",
      accent: "text-red-500 font-black",
      muted: "text-gray-500",
    },
    header:
      "font-black text-4xl md:text-6xl uppercase tracking-tighter leading-none",
    subheader: "font-bold text-2xl md:text-3xl uppercase tracking-wide",
    brutalistShape: "bg-black rotate-2 absolute -z-10",
  };

  const tabs = [
    "FORMS",
    "BUTTONS",
    "DATA",
    "INTERACTIVE",
    "OVERLAYS",
    "ADVANCED",
    "SYSTEM",
  ];

  return (
    <div className={brutalClasses.background}>
      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Background geometric shapes */}
        <div
          className={`${brutalClasses.brutalistShape} w-32 h-32 top-10 right-20`}
        ></div>
        <div
          className={`${brutalClasses.brutalistShape} w-20 h-20 top-32 left-10 rotate-45`}
        ></div>

        <div className="relative z-10 container mx-auto px-6 py-16">
          <div className="max-w-4xl">
            <h1
              className={`${brutalClasses.header} ${brutalClasses.text.primary} mb-4`}
            >
              BRUTAL
              <br />
              DESIGN
              <br />
              SYSTEM
            </h1>
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-2 bg-black"></div>
              <p
                className={`${brutalClasses.text.secondary} text-xl font-mono uppercase tracking-wider`}
              >
                RAW // FUNCTIONAL // UNCOMPROMISING
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
              <div className={brutalClasses.cardSecondary}>
                <Hash className="w-8 h-8 mb-2" />
                <div className="font-black uppercase text-sm">STRUCTURE</div>
                <div className="text-xs font-mono">GEOMETRIC PRECISION</div>
              </div>
              <div className={brutalClasses.cardSecondary}>
                <Square className="w-8 h-8 mb-2" />
                <div className="font-black uppercase text-sm">FUNCTION</div>
                <div className="text-xs font-mono">FORM FOLLOWS PURPOSE</div>
              </div>
              <div className={brutalClasses.cardSecondary}>
                <Triangle className="w-8 h-8 mb-2" />
                <div className="font-black uppercase text-sm">IMPACT</div>
                <div className="text-xs font-mono">BOLD STATEMENTS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-50 border-t-4 border-b-4 border-black">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-3 font-black uppercase tracking-wider border-4 border-black transition-all duration-150 ${
                  selectedTab === tab
                    ? "bg-black text-white shadow-none translate-x-[4px] translate-y-[4px]"
                    : "bg-white text-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 space-y-16">
        {/* Forms Section */}
        {selectedTab === "FORMS" && (
          <div className="space-y-8">
            <h2
              className={`${brutalClasses.subheader} ${brutalClasses.text.primary} mb-8`}
            >
              INPUT CONTROLS
            </h2>
            <div className={brutalClasses.card}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label
                      className={`${brutalClasses.text.primary} font-bold uppercase tracking-wider mb-2 block`}
                    >
                      FULL NAME
                    </Label>
                    <Input
                      className={brutalClasses.input}
                      placeholder="ENTER YOUR NAME HERE"
                    />
                  </div>
                  <div>
                    <Label
                      className={`${brutalClasses.text.primary} font-bold uppercase tracking-wider mb-2 block`}
                    >
                      EMAIL ADDRESS
                    </Label>
                    <Input
                      type="email"
                      className={brutalClasses.input}
                      placeholder="YOUR@EMAIL.COM"
                    />
                  </div>
                  <div>
                    <Label
                      className={`${brutalClasses.text.primary} font-bold uppercase tracking-wider mb-2 block`}
                    >
                      DEPARTMENT
                    </Label>
                    <Select>
                      <SelectTrigger className={brutalClasses.input}>
                        <SelectValue placeholder="CHOOSE DEPARTMENT" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000]">
                        <SelectItem
                          value="dev"
                          className="font-mono uppercase hover:bg-gray-100"
                        >
                          DEVELOPMENT
                        </SelectItem>
                        <SelectItem
                          value="design"
                          className="font-mono uppercase hover:bg-gray-100"
                        >
                          DESIGN
                        </SelectItem>
                        <SelectItem
                          value="marketing"
                          className="font-mono uppercase hover:bg-gray-100"
                        >
                          MARKETING
                        </SelectItem>
                        <SelectItem
                          value="sales"
                          className="font-mono uppercase hover:bg-gray-100"
                        >
                          SALES
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gray-50 border-4 border-black p-6">
                    <h3 className="font-black uppercase mb-4">FORM PREVIEW</h3>
                    <div className="space-y-2 font-mono text-sm">
                      <div>NAME: [EMPTY]</div>
                      <div>EMAIL: [EMPTY]</div>
                      <div>DEPT: [NOT SELECTED]</div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button className={brutalClasses.button.primary}>
                      SUBMIT
                    </Button>
                    <Button className={brutalClasses.button.secondary}>
                      RESET
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Buttons Section */}
        {selectedTab === "BUTTONS" && (
          <div className="space-y-8">
            <h2
              className={`${brutalClasses.subheader} ${brutalClasses.text.primary} mb-8`}
            >
              ACTION TRIGGERS
            </h2>
            <div className={brutalClasses.card}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <h3 className="font-black uppercase mb-4 text-lg">
                    PRIMARY ACTIONS
                  </h3>
                  <div className="space-y-4">
                    <Button
                      className={`${brutalClasses.button.primary} w-full`}
                    >
                      SAVE CHANGES
                    </Button>
                    <Button
                      className={`${brutalClasses.button.primary} w-full`}
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      CONTINUE
                    </Button>
                    <Button
                      className={`${brutalClasses.button.primary} w-full text-sm`}
                    >
                      PROCESS DATA
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-black uppercase mb-4 text-lg">
                    SECONDARY ACTIONS
                  </h3>
                  <div className="space-y-4">
                    <Button
                      className={`${brutalClasses.button.secondary} w-full`}
                    >
                      CANCEL
                    </Button>
                    <Button
                      className={`${brutalClasses.button.secondary} w-full`}
                    >
                      GO BACK
                    </Button>
                    <Button
                      className={`${brutalClasses.button.secondary} w-full text-sm`}
                    >
                      VIEW DETAILS
                    </Button>
                  </div>
                </div>
                <div>
                  <h3 className="font-black uppercase mb-4 text-lg">
                    DESTRUCTIVE
                  </h3>
                  <div className="space-y-4">
                    <Button className={`${brutalClasses.button.danger} w-full`}>
                      DELETE
                    </Button>
                    <Button className={`${brutalClasses.button.danger} w-full`}>
                      REMOVE ALL
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className={`${brutalClasses.button.danger} w-full text-sm`}
                        >
                          TERMINATE
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_#000000]">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-black uppercase text-2xl">
                            CONFIRM DESTRUCTION
                          </AlertDialogTitle>
                          <AlertDialogDescription className="font-mono text-gray-600">
                            THIS ACTION CANNOT BE UNDONE. ALL DATA WILL BE
                            PERMANENTLY REMOVED FROM THE SYSTEM.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-4">
                          <AlertDialogCancel
                            className={brutalClasses.button.secondary}
                          >
                            ABORT
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className={brutalClasses.button.danger}
                          >
                            CONFIRM DELETION
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Section */}
        {selectedTab === "DATA" && (
          <div className="space-y-8">
            <h2
              className={`${brutalClasses.subheader} ${brutalClasses.text.primary} mb-8`}
            >
              INFORMATION DISPLAY
            </h2>
            <div className={brutalClasses.card}>
              <div className="space-y-8">
                {/* Progress Indicators */}
                <div>
                  <h3 className="font-black uppercase mb-6 text-lg">
                    PROGRESS TRACKING
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold uppercase">COMPLETION</span>
                        <span className="font-mono font-black">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full h-8 bg-gray-200 border-4 border-black">
                        <div
                          className="h-full bg-black transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold uppercase">
                          MEMORY USAGE
                        </span>
                        <span className="font-mono font-black">84%</span>
                      </div>
                      <div className="w-full h-8 bg-gray-200 border-4 border-black">
                        <div className="h-full bg-red-500 w-[84%]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div>
                  <h3 className="font-black uppercase mb-6 text-lg">
                    STATUS INDICATORS
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <Badge className="bg-green-500 text-white border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0px_0px_#000000]">
                      ACTIVE
                    </Badge>
                    <Badge className="bg-yellow-500 text-black border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0px_0px_#000000]">
                      PENDING
                    </Badge>
                    <Badge className="bg-red-500 text-white border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0px_0px_#000000]">
                      ERROR
                    </Badge>
                    <Badge className="bg-gray-500 text-white border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0px_0px_#000000]">
                      DISABLED
                    </Badge>
                    <Badge className="bg-blue-500 text-white border-4 border-black font-bold uppercase px-4 py-2 shadow-[4px_4px_0px_0px_#000000]">
                      PROCESSING
                    </Badge>
                  </div>
                </div>

                {/* Data Table */}
                <div>
                  <h3 className="font-black uppercase mb-6 text-lg">
                    DATA TABLE
                  </h3>
                  <Table className={brutalClasses.table.container}>
                    <TableCaption className="font-bold text-lg uppercase mt-6 text-black">
                      SYSTEM COMPONENTS STATUS
                    </TableCaption>
                    <TableHeader className={brutalClasses.table.header}>
                      <TableRow>
                        <TableHead className={brutalClasses.table.headerCell}>
                          ID
                        </TableHead>
                        <TableHead className={brutalClasses.table.headerCell}>
                          COMPONENT
                        </TableHead>
                        <TableHead className={brutalClasses.table.headerCell}>
                          STATUS
                        </TableHead>
                        <TableHead className={brutalClasses.table.headerCell}>
                          VALUE
                        </TableHead>
                        <TableHead className={brutalClasses.table.headerCell}>
                          ACTIONS
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className={brutalClasses.table.row}>
                        <TableCell className={brutalClasses.table.cell}>
                          001
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          SYSTEM CORE
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          <Badge className="bg-green-500 text-white border-2 border-black font-bold uppercase">
                            ONLINE
                          </Badge>
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          $12,450
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          <Button
                            size="sm"
                            className="bg-black text-white border-2 border-black hover:bg-white hover:text-black font-bold uppercase px-3 py-1 rounded-none"
                          >
                            VIEW
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow className={brutalClasses.table.row}>
                        <TableCell className={brutalClasses.table.cell}>
                          002
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          DATABASE
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          <Badge className="bg-yellow-500 text-black border-2 border-black font-bold uppercase">
                            MAINT
                          </Badge>
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          $8,920
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          <Button
                            size="sm"
                            className="bg-black text-white border-2 border-black hover:bg-white hover:text-black font-bold uppercase px-3 py-1 rounded-none"
                          >
                            VIEW
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow className={brutalClasses.table.row}>
                        <TableCell className={brutalClasses.table.cell}>
                          003
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          API GATEWAY
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          <Badge className="bg-red-500 text-white border-2 border-black font-bold uppercase">
                            ERROR
                          </Badge>
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          $0
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          <Button
                            size="sm"
                            className="bg-red-500 text-white border-2 border-black hover:bg-red-700 hover:text-white font-bold uppercase px-3 py-1 rounded-none"
                          >
                            FIX
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow className={brutalClasses.table.row}>
                        <TableCell className={brutalClasses.table.cell}>
                          004
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          CACHE LAYER
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          <Badge className="bg-green-500 text-white border-2 border-black font-bold uppercase">
                            ONLINE
                          </Badge>
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          $3,240
                        </TableCell>
                        <TableCell className={brutalClasses.table.cell}>
                          <Button
                            size="sm"
                            className="bg-black text-white border-2 border-black hover:bg-white hover:text-black font-bold uppercase px-3 py-1 rounded-none"
                          >
                            VIEW
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Section */}
        {selectedTab === "INTERACTIVE" && (
          <div className="space-y-8">
            <h2
              className={`${brutalClasses.subheader} ${brutalClasses.text.primary} mb-8`}
            >
              INTERACTIVE COMPONENTS
            </h2>

            {/* Checkboxes */}
            <div className={brutalClasses.card}>
              <h3 className="font-black text-xl uppercase mb-6">CHECKBOXES</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Checkbox id="check1" className={brutalClasses.checkbox} />
                  <Label
                    htmlFor="check1"
                    className="font-bold text-lg cursor-pointer"
                  >
                    ENABLE BRUTAL MODE
                  </Label>
                </div>
                <div className="flex items-center space-x-4">
                  <Checkbox
                    id="check2"
                    className={brutalClasses.checkbox}
                    defaultChecked
                  />
                  <Label
                    htmlFor="check2"
                    className="font-bold text-lg cursor-pointer"
                  >
                    HIGH CONTRAST ACTIVE
                  </Label>
                </div>
                <div className="flex items-center space-x-4">
                  <Checkbox id="check3" className={brutalClasses.checkbox} />
                  <Label
                    htmlFor="check3"
                    className="font-bold text-lg cursor-pointer"
                  >
                    SHADOW EFFECTS
                  </Label>
                </div>
              </div>
            </div>

            {/* Calendar */}
            <div className={brutalClasses.card}>
              <h3 className="font-black text-xl uppercase mb-6">
                CALENDAR PICKER
              </h3>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className={brutalClasses.calendar.container}
                  classNames={{
                    months: brutalClasses.calendar.months,
                    month: brutalClasses.calendar.month,
                    caption: brutalClasses.calendar.caption,
                    caption_label: brutalClasses.calendar.caption_label,
                    nav: brutalClasses.calendar.nav,
                    nav_button: brutalClasses.calendar.nav_button,
                    nav_button_previous:
                      brutalClasses.calendar.nav_button_previous,
                    nav_button_next: brutalClasses.calendar.nav_button_next,
                    table: brutalClasses.calendar.table,
                    head_row: brutalClasses.calendar.head_row,
                    head_cell: brutalClasses.calendar.head_cell,
                    row: brutalClasses.calendar.row,
                    cell: brutalClasses.calendar.cell,
                    day: brutalClasses.calendar.day,
                    day_selected: brutalClasses.calendar.day_selected,
                    day_today: brutalClasses.calendar.day_today,
                    day_outside: brutalClasses.calendar.day_outside,
                    day_disabled: brutalClasses.calendar.day_disabled,
                    day_range_middle: brutalClasses.calendar.day_range_middle,
                    day_hidden: brutalClasses.calendar.day_hidden,
                  }}
                />
              </div>
            </div>

            {/* Command Palette */}
            <div className={brutalClasses.card}>
              <h3 className="font-black text-xl uppercase mb-6">
                COMMAND PALETTE
              </h3>
              <Command className={brutalClasses.command.container}>
                <CommandInput
                  placeholder="TYPE COMMAND..."
                  className={brutalClasses.command.input}
                />
                <CommandList>
                  <CommandEmpty className="px-6 py-4 font-bold text-gray-500">
                    NO RESULTS FOUND
                  </CommandEmpty>
                  <CommandGroup>
                    <div className={brutalClasses.command.groupHeading}>
                      NAVIGATION
                    </div>
                    <CommandItem className={brutalClasses.command.item}>
                      <User className="mr-4 h-6 w-6" />
                      <span>PROFILE SETTINGS</span>
                    </CommandItem>
                    <CommandItem className={brutalClasses.command.item}>
                      <Database className="mr-4 h-6 w-6" />
                      <span>DATA MANAGEMENT</span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandGroup>
                    <div className={brutalClasses.command.groupHeading}>
                      SYSTEM
                    </div>
                    <CommandItem className={brutalClasses.command.item}>
                      <Settings className="mr-4 h-6 w-6" />
                      <span>SYSTEM SETTINGS</span>
                    </CommandItem>
                    <CommandItem className={brutalClasses.command.item}>
                      <Search className="mr-4 h-6 w-6" />
                      <span>GLOBAL SEARCH</span>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </div>
        )}

        {/* Overlays Section */}
        {selectedTab === "OVERLAYS" && (
          <div className="space-y-8">
            <h2
              className={`${brutalClasses.subheader} ${brutalClasses.text.primary} mb-8`}
            >
              OVERLAY COMPONENTS
            </h2>

            {/* Dialogs */}
            <div className={brutalClasses.card}>
              <h3 className="font-black text-xl uppercase mb-6">DIALOGS</h3>
              <div className="flex flex-wrap gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className={brutalClasses.button.primary}>
                      OPEN DIALOG
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={brutalClasses.dialog.content}>
                    <DialogHeader>
                      <DialogTitle className={brutalClasses.dialog.title}>
                        BRUTAL DIALOG
                      </DialogTitle>
                      <DialogDescription
                        className={brutalClasses.dialog.description}
                      >
                        This is a brutalist-styled dialog with sharp edges, high
                        contrast, and bold typography. No rounded corners, no
                        subtle shadows - just pure, functional design.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-4 mt-6">
                      <Button className={brutalClasses.button.secondary}>
                        CANCEL
                      </Button>
                      <Button className={brutalClasses.button.primary}>
                        CONFIRM
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Hover Cards */}
            <div className={brutalClasses.card}>
              <h3 className="font-black text-xl uppercase mb-6">HOVER CARDS</h3>
              <div className="space-y-4">
                <p className="font-bold text-lg">
                  Hover over{" "}
                  <HoverCard>
                    <HoverCardTrigger
                      className={brutalClasses.hoverCard.trigger}
                    >
                      BRUTAL DESIGN
                    </HoverCardTrigger>
                    <HoverCardContent
                      className={brutalClasses.hoverCard.content}
                    >
                      <div className="space-y-2">
                        <h4 className="font-black text-lg uppercase">
                          BRUTAL DESIGN
                        </h4>
                        <p className="font-bold text-sm">
                          An architectural and design philosophy emphasizing raw
                          materials, geometric forms, and functional expression.
                        </p>
                        <div className="flex items-center space-x-2 mt-4">
                          <Square className="w-4 h-4" />
                          <span className="font-mono text-xs">EST. 1950s</span>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>{" "}
                  to see more information.
                </p>
              </div>
            </div>

            {/* Avatars */}
            <div className={brutalClasses.card}>
              <h3 className="font-black text-xl uppercase mb-6">
                USER AVATARS
              </h3>
              <div className="flex flex-wrap gap-6">
                <div className="text-center">
                  <Avatar className={brutalClasses.avatar.container}>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className={brutalClasses.avatar.fallback}>
                      CN
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-sm mt-2">WITH IMAGE</p>
                </div>
                <div className="text-center">
                  <Avatar className={brutalClasses.avatar.container}>
                    <AvatarFallback className={brutalClasses.avatar.fallback}>
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-sm mt-2">INITIALS ONLY</p>
                </div>
                <div className="text-center">
                  <Avatar className={brutalClasses.avatar.container}>
                    <AvatarFallback className={brutalClasses.avatar.fallback}>
                      <User className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-sm mt-2">ICON AVATAR</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Advanced Section */}
        {selectedTab === "ADVANCED" && (
          <div className="space-y-8">
            <h2
              className={`${brutalClasses.subheader} ${brutalClasses.text.primary} mb-8`}
            >
              ADVANCED COMPONENTS
            </h2>

            {/* Popover */}
            <div className={brutalClasses.card}>
              <h3 className="font-black text-xl uppercase mb-6">POPOVERS</h3>
              <div className="flex flex-wrap gap-4">
                <Popover>
                  <PopoverTrigger className={brutalClasses.popover.trigger}>
                    OPEN POPOVER
                  </PopoverTrigger>
                  <PopoverContent className={brutalClasses.popover.content}>
                    <div className="space-y-4">
                      <h4 className="font-black text-lg uppercase">
                        SETTINGS PANEL
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="setting1"
                            className={brutalClasses.checkbox}
                          />
                          <Label htmlFor="setting1" className="font-bold">
                            ENABLE NOTIFICATIONS
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="setting2"
                            className={brutalClasses.checkbox}
                            defaultChecked
                          />
                          <Label htmlFor="setting2" className="font-bold">
                            AUTO-SAVE
                          </Label>
                        </div>
                      </div>
                      <Button className={brutalClasses.button.primary}>
                        APPLY SETTINGS
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger className={brutalClasses.popover.trigger}>
                    USER INFO
                  </PopoverTrigger>
                  <PopoverContent className={brutalClasses.popover.content}>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className={brutalClasses.avatar.container}>
                          <AvatarFallback
                            className={brutalClasses.avatar.fallback}
                          >
                            JD
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-black text-lg">JOHN DOE</h4>
                          <p className="font-bold text-gray-600">
                            SYSTEM ADMIN
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-sm">
                        Last login: TODAY, 09:15 AM
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Skeleton Loading States */}
            <div className={brutalClasses.card}>
              <h3 className="font-black text-xl uppercase mb-6">
                LOADING STATES
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-4">PROFILE LOADING</h4>
                  <div className="flex items-center space-x-4">
                    <Skeleton
                      className={`${brutalClasses.skeleton.avatar} h-16 w-16`}
                    />
                    <div className="space-y-3">
                      <Skeleton
                        className={`${brutalClasses.skeleton.text} h-6 w-32`}
                      />
                      <Skeleton
                        className={`${brutalClasses.skeleton.text} h-4 w-24`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4">CONTENT LOADING</h4>
                  <div className="space-y-3">
                    <Skeleton
                      className={`${brutalClasses.skeleton.text} h-8 w-full`}
                    />
                    <Skeleton
                      className={`${brutalClasses.skeleton.text} h-6 w-3/4`}
                    />
                    <Skeleton
                      className={`${brutalClasses.skeleton.text} h-6 w-1/2`}
                    />
                    <Skeleton
                      className={`${brutalClasses.skeleton.text} h-4 w-2/3`}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-lg mb-4">CARD LOADING</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className={brutalClasses.cardSecondary}>
                        <Skeleton
                          className={`${brutalClasses.skeleton.text} h-6 w-3/4 mb-3`}
                        />
                        <Skeleton
                          className={`${brutalClasses.skeleton.text} h-4 w-full mb-2`}
                        />
                        <Skeleton
                          className={`${brutalClasses.skeleton.text} h-4 w-2/3`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dropdown Menu */}
            <div className={brutalClasses.card}>
              <h3 className="font-black text-xl uppercase mb-6">
                DROPDOWN MENUS
              </h3>
              <div className="flex flex-wrap gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={brutalClasses.dropdown.trigger}
                  >
                    <MoreHorizontal className="w-5 h-5 mr-2" />
                    ACTIONS
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className={brutalClasses.dropdown.content}
                  >
                    <DropdownMenuLabel className={brutalClasses.dropdown.label}>
                      ACTIONS
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator
                      className={brutalClasses.dropdown.separator}
                    />
                    <DropdownMenuItem className={brutalClasses.dropdown.item}>
                      <Edit className="w-4 h-4 mr-2" />
                      EDIT
                    </DropdownMenuItem>
                    <DropdownMenuItem className={brutalClasses.dropdown.item}>
                      <Download className="w-4 h-4 mr-2" />
                      DOWNLOAD
                    </DropdownMenuItem>
                    <DropdownMenuSeparator
                      className={brutalClasses.dropdown.separator}
                    />
                    <DropdownMenuItem
                      className={`${brutalClasses.dropdown.item} text-red-500`}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      DELETE
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={brutalClasses.dropdown.trigger}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    CREATE
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className={brutalClasses.dropdown.content}
                  >
                    <DropdownMenuLabel className={brutalClasses.dropdown.label}>
                      CREATE NEW
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator
                      className={brutalClasses.dropdown.separator}
                    />
                    <DropdownMenuItem className={brutalClasses.dropdown.item}>
                      <User className="w-4 h-4 mr-2" />
                      USER
                    </DropdownMenuItem>
                    <DropdownMenuItem className={brutalClasses.dropdown.item}>
                      <Database className="w-4 h-4 mr-2" />
                      PROJECT
                    </DropdownMenuItem>
                    <DropdownMenuItem className={brutalClasses.dropdown.item}>
                      <Settings className="w-4 h-4 mr-2" />
                      WORKSPACE
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Notifications */}
            <div className={brutalClasses.card}>
              <h3 className="font-black text-xl uppercase mb-6">
                NOTIFICATIONS
              </h3>
              <div className="space-y-4">
                <p className="font-bold text-lg">
                  Click buttons to trigger brutal-styled toast notifications:
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    className={brutalClasses.button.primary}
                    onClick={() =>
                      toast("SUCCESS!", {
                        description: "OPERATION COMPLETED SUCCESSFULLY",
                        style: {
                          background: "white",
                          border: "4px solid black",
                          boxShadow: "6px 6px 0px 0px #333333",
                          borderRadius: "0",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        },
                      })
                    }
                  >
                    <Bell className="w-5 h-5 mr-2" />
                    SUCCESS
                  </Button>

                  <Button
                    className={brutalClasses.button.danger}
                    onClick={() =>
                      toast.error("ERROR!", {
                        description: "SOMETHING WENT WRONG",
                        style: {
                          background: "white",
                          border: "4px solid red",
                          boxShadow: "6px 6px 0px 0px #dc2626",
                          borderRadius: "0",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          color: "red",
                        },
                      })
                    }
                  >
                    <Trash className="w-5 h-5 mr-2" />
                    ERROR
                  </Button>

                  <Button
                    className={brutalClasses.button.secondary}
                    onClick={() =>
                      toast("INFO", {
                        description: "SYSTEM NOTIFICATION",
                        style: {
                          background: "black",
                          border: "4px solid white",
                          boxShadow: "6px 6px 0px 0px #666666",
                          borderRadius: "0",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          color: "white",
                        },
                      })
                    }
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    INFO
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Section */}
        {selectedTab === "SYSTEM" && (
          <div className="space-y-8">
            <h2
              className={`${brutalClasses.subheader} ${brutalClasses.text.primary} mb-8`}
            >
              SYSTEM TERMINAL
            </h2>
            <div className={brutalClasses.card}>
              <div className="space-y-6">
                <div className="bg-black text-green-400 p-6 font-mono text-sm border-4 border-gray-600">
                  <div className="mb-4">
                    <span className="text-white font-bold">[SYSTEM]</span>{" "}
                    BRUTAL DESIGN TERMINAL v2.1.0
                  </div>
                  <div className="space-y-1">
                    <div>&gt; INITIALIZING BRUTAL UI COMPONENTS...</div>
                    <div>&gt; LOADING GEOMETRIC FRAMEWORKS... OK</div>
                    <div>&gt; APPLYING CONTRAST FILTERS... OK</div>
                    <div>&gt; SETTING TYPOGRAPHY WEIGHTS... OK</div>
                    <div>&gt; ENABLING SHADOW SYSTEMS... OK</div>
                    <div>&gt; BRUTAL DESIGN SYSTEM READY</div>
                    <div className="mt-4">
                      <span className="text-yellow-400">&gt; _</span>
                      <span className="animate-pulse">|</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={brutalClasses.cardSecondary}>
                    <h4 className="font-black uppercase mb-4">
                      TYPOGRAPHY SCALE
                    </h4>
                    <div className="space-y-2">
                      <div className="text-4xl font-black">HEADLINE</div>
                      <div className="text-2xl font-bold">SUBHEADING</div>
                      <div className="text-lg font-medium">Body Text</div>
                      <div className="text-sm font-mono">SYSTEM.MONO</div>
                    </div>
                  </div>

                  <div className={brutalClasses.cardSecondary}>
                    <h4 className="font-black uppercase mb-4">COLOR SYSTEM</h4>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="w-full h-12 bg-black border-2 border-gray-400"></div>
                      <div className="w-full h-12 bg-white border-2 border-black"></div>
                      <div className="w-full h-12 bg-red-500 border-2 border-black"></div>
                      <div className="w-full h-12 bg-gray-500 border-2 border-black"></div>
                    </div>
                    <div className="mt-2 font-mono text-xs">
                      BLACK / WHITE / ACCENT / NEUTRAL
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Separator className="border-t-4 border-black my-16" />

        {/* Footer */}
        <div className="text-center py-16">
          <div className="max-w-2xl mx-auto">
            <h3
              className={`${brutalClasses.subheader} ${brutalClasses.text.primary} mb-6`}
            >
              DESIGN PHILOSOPHY
            </h3>
            <div className="space-y-4 font-mono text-gray-600">
              <p className="uppercase tracking-wider">
                "FORM FOLLOWS FUNCTION, STRIPPED OF ALL NON-ESSENTIAL
                DECORATION"
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Minus className="w-8 h-8" />
                <span className="font-black text-black">
                  BRUTAL DESIGN SYSTEM
                </span>
                <Minus className="w-8 h-8" />
              </div>
              <p className="text-sm">
                INSPIRED BY BRUTALIST ARCHITECTURE // KUAMA TECHNOLOGIES 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
