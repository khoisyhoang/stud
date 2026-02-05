'use client';

import { useState, useCallback } from 'react';
import { X, MapPin, Clock, Users, BookOpen, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(50, 'Title too long'),
  subject: z.string().min(1, 'Subject is required'),
  type: z.enum(['silent', 'discussion', 'exam-prep']),
  maxParticipants: z.number().min(2, 'Minimum 2 participants').max(50, 'Maximum 50 participants'),
  duration: z.number().min(30, 'Minimum 30 minutes').max(480, 'Maximum 8 hours'),
  description: z.string().max(200, 'Description too long').optional(),
  location: z.string().min(3, 'Location must be at least 3 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (data: FormData & { lat: number; lng: number }) => void;
  userLocation?: { lat: number; lng: number } | null;
}

const sessionTypes = [
  { value: 'silent', label: 'Silent Focus', description: 'Quiet, individual study' },
  { value: 'discussion', label: 'Discussion', description: 'Collaborative learning' },
  { value: 'exam-prep', label: 'Exam Prep', description: 'Focused test preparation' },
];

const popularSubjects = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Engineering', 'Medicine', 'Business', 'Law', 'Psychology',
  'Economics', 'Literature', 'History', 'Philosophy', 'Art'
];

export function CreateSessionModal({ 
  isOpen, 
  onClose, 
  onCreateSession, 
  userLocation 
}: CreateSessionModalProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    userLocation || null
  );
  const [isLocating, setIsLocating] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subject: '',
      type: 'silent',
      maxParticipants: 10,
      duration: 120,
      description: '',
      location: '',
    },
  });

  const handleGetCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      form.setError('location', { message: 'Geolocation not supported' });
      return;
    }

    setIsLocating(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      
      setSelectedLocation(location);
      form.setValue('location', 'Current Location');
      setIsLocating(false);
    } catch (error) {
      form.setError('location', { message: 'Failed to get location' });
      setIsLocating(false);
    }
  }, [form]);

  const onSubmit = useCallback((data: FormData) => {
    if (!selectedLocation) {
      form.setError('location', { message: 'Please select a location' });
      return;
    }

    onCreateSession({
      ...data,
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
    });
    
    form.reset();
    setSelectedLocation(null);
    onClose();
  }, [selectedLocation, onCreateSession, form, onClose]);

  const handleClose = useCallback(() => {
    form.reset();
    setSelectedLocation(null);
    onClose();
  }, [form, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Create Study Session</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Deep Focus: Algorithms Study" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Computer Science" 
                        list="subjects"
                        {...field} 
                      />
                    </FormControl>
                    <datalist id="subjects">
                      {popularSubjects.map(subject => (
                        <option key={subject} value={subject} />
                      ))}
                    </datalist>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What will you be studying? Any specific topics?" 
                        className="resize-none"
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Session Type */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Session Type</h3>
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select session type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sessionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex flex-col">
                              <span className="font-medium">{type.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {type.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Session Details */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Participants</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={2}
                        max={50}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min={30}
                        max={480}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 120)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session Location</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Enter address or use current location" 
                          {...field} 
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleGetCurrentLocation}
                          disabled={isLocating}
                          className="shrink-0"
                        >
                          <MapPin className={cn(
                            "h-4 w-4",
                            isLocating && "animate-spin"
                          )} />
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    {selectedLocation && (
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <MapPin className="h-3 w-3" />
                        <span>Location selected</span>
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>

            {/* Error Display */}
            {form.formState.errors.root && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">
                  {form.formState.errors.root.message}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="flex-1"
              >
                {form.formState.isSubmitting ? 'Creating...' : 'Create Session'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
